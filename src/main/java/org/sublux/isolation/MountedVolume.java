package org.sublux.isolation;

import com.github.dockerjava.api.model.Mount;
import com.github.dockerjava.api.model.MountType;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;

public class MountedVolume implements Closeable {
    private File externalMountPoint;
    private File driveFile;
    private long limit;
    private final MountedVolumeManager manager;

    public MountedVolume(File externalMountPoint, File fs, long limit, MountedVolumeManager manager) {
        this.externalMountPoint = externalMountPoint;
        this.driveFile = fs;
        this.limit = limit;
        this.manager = manager;
    }

    public File getExternalMountPoint() {
        return externalMountPoint;
    }

    public void setExternalMountPoint(File externalMountPoint) {
        this.externalMountPoint = externalMountPoint;
    }

    public File getDriveFile() {
        return driveFile;
    }

    public void setDriveFile(File driveFile) {
        this.driveFile = driveFile;
    }

    public long getLimit() {
        return limit;
    }

    public void setLimit(long limit) {
        this.limit = limit;
    }

    public Mount getMount() {
        return new Mount().withSource(externalMountPoint.getAbsolutePath()).withType(MountType.BIND);
    }

    @Override
    public String toString() {
        return "MountedVolume{" +
                "externalMountPoint=" + externalMountPoint +
                ", driveFile=" + driveFile +
                ", limit=" + limit +
                ", manager=" + manager +
                '}';
    }

    @Override
    public void close() throws IOException {
        if (externalMountPoint.exists())
            manager.deleteMountedVolume(this);
    }
}
