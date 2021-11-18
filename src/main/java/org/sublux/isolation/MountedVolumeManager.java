package org.sublux.isolation;

import org.springframework.stereotype.Service;
import org.sublux.isolation.privileged.UnprivilegedExecutorClient;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.TimeUnit;

@Service
public class MountedVolumeManager {
    private final UnprivilegedExecutorClient executorClient;

    public MountedVolumeManager(UnprivilegedExecutorClient executorClient) {
        this.executorClient = executorClient;
    }

    private void createFSFile(File fs, long sizeMB) throws TerminationException, IOException {
        ProcessBuilder processBuilder = new ProcessBuilder("mkfs.ext4", fs.getAbsolutePath(), String.format("%dm", sizeMB));
        String processCommand = processBuilder.command().stream().reduce("", (s, s2) -> s + " " + s2);
        Process process = processBuilder.start();
        try {
            process.waitFor(1, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        if (process.isAlive()) {
            process.destroyForcibly();
            try {
                process.waitFor(1, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            if (process.isAlive()) {
                throw new TerminationException("Can not stop subprocess:" + processCommand);
            }
        }
        if (process.exitValue() != 0) {
            throw new TerminationException("Nonzero exit value for subprocess:" + processCommand);
        }
    }

    public MountedVolume createMountedVolume(long sizeMB) throws IOException, TerminationException {
        File fs = Files.createTempFile("sublux", ".ext4").toFile();
        File mountPoint = Files.createTempDirectory("sublux").toFile();
        try {
            createFSFile(fs, sizeMB);
        } catch (IOException | TerminationException e) {
            e.printStackTrace();
            fs.delete();
            mountPoint.delete();
            throw e;
        }
        try {
            executorClient.executeVolumeMounting(fs, mountPoint);
        } catch (IOException e) {
            e.printStackTrace();
            fs.delete();
            mountPoint.delete();
            throw e;
        }
        return new MountedVolume(mountPoint, fs, sizeMB);
    }
}
