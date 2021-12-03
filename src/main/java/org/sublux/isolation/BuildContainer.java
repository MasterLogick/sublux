package org.sublux.isolation;

import com.github.dockerjava.api.DockerClient;
import org.sublux.entity.Language;
import org.sublux.entity.Program;
import org.sublux.entity.Report;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class BuildContainer extends Container {
    public static final String volumeMountPointInternal = "/sublux";
    public static final String scriptPath = "/build.sh";
    public static final String[] CMD_COMMAND = {"sh", volumeMountPointInternal + scriptPath,
            volumeMountPointInternal + "/src", volumeMountPointInternal + "/out"};

    private final Language language;
    private final MountedVolume volume;
    private final int buildTimeout;

    public BuildContainer(Language language, MountedVolume volume, String id, int buildTimeout, int logObtainTimeout, DockerClient client) {
        super(id, client, logObtainTimeout);
        this.language = language;
        this.volume = volume;
        this.buildTimeout = buildTimeout;
    }

    public void buildSolution(Program solution, Report report) throws IOException, InterruptedException {
        if (!solution.getLang().getId().equals(language.getId())) {
            throw new IllegalArgumentException("Container prepared for another language");
        }
        prepareContext();
        extractSrc(solution.getArchivedData());
        copyBuildScript(solution.getLang().getBuildScript());
        startContainer();
        await(buildTimeout, TimeUnit.MILLISECONDS);
        stopAndGenerateReport(report);
    }

    File getBuiltSolution() {
        return new File(volume.getExternalMountPoint(), "/out");
    }

    private void extractSrc(byte[] zip) throws IOException {
        File src = new File(volume.getExternalMountPoint(), "src");
        byte[] buff = new byte[4096];
        ZipInputStream zin = new ZipInputStream(new ByteArrayInputStream(zip));
        try {
            for (ZipEntry e = zin.getNextEntry(); e != null; e = zin.getNextEntry()) {
                File f = new File(src, e.getName());
                FileOutputStream fos = new FileOutputStream(f);
                for (int read = zin.read(buff); read != -1; read = zin.read(buff)) {
                    fos.write(buff, 0, read);
                }
                fos.close();
            }
        } finally {
            try {
                zin.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void copyBuildScript(byte[] data) throws IOException {
        File script = new File(volume.getExternalMountPoint(), scriptPath);
        FileOutputStream fos = new FileOutputStream(script);
        fos.write(data);
        fos.close();
    }

    private void prepareContext() {
        File outDir = new File(volume.getExternalMountPoint(), "out");
        outDir.mkdir();
        File src = new File(volume.getExternalMountPoint(), "src");
        src.mkdir();
    }

    @Override
    public void close() throws IOException {
        super.close();
        volume.close();
    }
}
