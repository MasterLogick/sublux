package org.sublux.isolation;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.exception.NotModifiedException;
import com.github.dockerjava.api.model.Frame;
import org.sublux.entity.Report;

import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;

public class Container implements Closeable {
    private final String id;
    private final DockerClient client;
    private final long logObtainTimeout;

    public Container(String id, DockerClient client, long logObtainTimeout) {
        this.id = id;
        this.client = client;
        this.logObtainTimeout = logObtainTimeout;
    }

    public String getId() {
        return id;
    }

    protected Report stopAndGenerateReport() throws InterruptedException, IOException {
        Report report = new Report();
        report.setState(Report.State.SUCCESS);
        InspectContainerResponse inspection = client.inspectContainerCmd(getId()).exec();
        if (!inspection.getState().getStatus().equals("exited")) {
            try {
                client.stopContainerCmd(getId()).exec();
            } catch (NotModifiedException ignored) {
            }
            report.setState(Report.State.TIME_LIMIT_EXCEEDED);
        }
        if (!inspection.getState().getExitCodeLong().equals(0L)) {
            report.setState(Report.State.RUNTIME_EXCEPTION);
        }
        if (Boolean.TRUE.equals(inspection.getState().getOOMKilled())) {
            report.setState(Report.State.MEMORY_LIMIT_EXCEEDED);
        }
        ByteArrayOutputStream compressedLog = new ByteArrayOutputStream();
        DeflaterOutputStream deflaterOutputStream = new DeflaterOutputStream(compressedLog, new Deflater(5, false));
        ResultCallback.Adapter<Frame> callback = client.logContainerCmd(getId())
                .withStdErr(true)
                .withStdOut(true)
                .withFollowStream(false)
                .withTimestamps(false)
                .exec(new ResultCallback.Adapter<Frame>() {
                    @Override
                    public void onNext(Frame frame) {
                        try {
                            deflaterOutputStream.write(frame.getPayload());
                            String line = new String(frame.getPayload());
                            if (line.contains("Killed")) {
                                report.setState(Report.State.MEMORY_LIMIT_EXCEEDED);
                            }
                            if (line.contains("No space left on device")) {
                                report.setState(Report.State.VOLUME_QUOTA_EXCEEDED);
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
        callback.awaitCompletion(logObtainTimeout, TimeUnit.MILLISECONDS);
        deflaterOutputStream.close();
        report.setCompressedLog(compressedLog.toByteArray());
        return report;
    }

    protected void startContainer() {
        client.startContainerCmd(getId()).exec();
    }

    protected void await(long timeout, TimeUnit timeUnits) throws InterruptedException {
        client.waitContainerCmd(getId()).exec(new ResultCallback.Adapter<>()).awaitCompletion(timeout, timeUnits);
    }

    protected void removeContainer() {
        client.removeContainerCmd(getId()).withForce(true).withRemoveVolumes(true).exec();
    }

    @Override
    public void close() throws IOException {
        removeContainer();
    }
}
