package org.sublux.isolation;

import com.github.dockerjava.api.DockerClient;
import org.apache.commons.io.FileUtils;
import org.sublux.entity.Language;
import org.sublux.entity.Program;
import org.sublux.entity.Report;
import org.sublux.entity.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class RunContainer extends Container {
    public static final String volumeMountPointInternal = "/sublux";
    public static final String scriptPath = "/run.sh";
    public static final String[] CMD_COMMAND = {"sh", volumeMountPointInternal + scriptPath,
            volumeMountPointInternal + "/solution", volumeMountPointInternal + "/input", volumeMountPointInternal + "/output"};

    private final Language language;
    private final MountedVolume volume;
    private final int runTimeout;

    public RunContainer(Language language, MountedVolume volume, String id, int runTimeout, int logObtainTimeout, DockerClient client) {
        super(id, client, logObtainTimeout);
        this.language = language;
        this.volume = volume;
        this.runTimeout = runTimeout;
    }

    public void evaluateSolution(BuildContainer buildContainer, Program solution, Test test, Report report) throws IOException, InterruptedException {
        if (!solution.getLang().getId().equals(language.getId())) {
            throw new IllegalArgumentException("Container prepared for another language");
        }
        prepareContext();
        copySolution(buildContainer.getBuiltSolution());
        exportInput(test.getInput());
        copyRunScript(solution.getLang().getRunScript());
        startContainer();
        await(runTimeout, TimeUnit.MILLISECONDS);
        stopAndGenerateReport(report);
        if (report.getState() == Report.State.SUCCESS) {
            byte[] result = importOutput();
            if (!Arrays.equals(result, test.getOutput())) {
                report.setState(Report.State.WRONG_ANSWER);
            }
        }
    }

    private byte[] importOutput() throws IOException {
        File outputFile = new File(volume.getExternalMountPoint(), "output");
        FileInputStream fis = new FileInputStream(outputFile);
        byte[] result = new byte[(int) fis.getChannel().size()];
        int read = 0;
        while (read < result.length) {
            read += fis.read(result, read, result.length - read);
        }
        fis.close();
        return result;
    }

    private void copySolution(File builtSolution) throws IOException {
        FileUtils.copyDirectory(builtSolution, new File(volume.getExternalMountPoint(), "solution"));
    }

    private void exportInput(byte[] input) throws IOException {
        File inputFile = new File(volume.getExternalMountPoint(), "input");
        FileOutputStream fos = new FileOutputStream(inputFile);
        fos.write(input);
        fos.close();
    }

    private void copyRunScript(byte[] data) throws IOException {
        File script = new File(volume.getExternalMountPoint(), scriptPath);
        FileOutputStream fos = new FileOutputStream(script);
        fos.write(data);
        fos.close();
    }

    private void prepareContext() throws IOException {
        File solutionDir = new File(volume.getExternalMountPoint(), "solution");
        solutionDir.mkdir();
        File outputFile = new File(volume.getExternalMountPoint(), "output");
        outputFile.createNewFile();
    }

    @Override
    public void close() throws IOException {
        super.close();
        volume.close();
    }
}
