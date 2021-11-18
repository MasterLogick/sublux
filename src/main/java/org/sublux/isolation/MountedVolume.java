package org.sublux.isolation;

import com.github.dockerjava.api.model.Mount;
import com.github.dockerjava.api.model.MountType;

import java.io.File;

public class MountedVolume {
    private File externalMountPoint;
    private File driveFile;
    private long limit;

    public MountedVolume(File externalMountPoint, File fs, long limit) {
        this.externalMountPoint = externalMountPoint;
        this.driveFile = fs;
        this.limit = limit;
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
}
