package org.sublux.isolation.privileged;

import java.io.*;
import java.net.InetAddress;
import java.net.Socket;

public class UnprivilegedExecutorClient {
    private final Socket s;
    private final PrintStream commandStream;
    private final BufferedReader resultStream;
    private final Object locker = new Object();

    public UnprivilegedExecutorClient() throws IOException {
        PrivilegedExecutorServer server = new PrivilegedExecutorServer();
        server.start();
        server.getLocker().unlock();
        try {
            Object o = server.getAwait();
            synchronized (o) {
                o.wait();
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        int port = server.getPort().get();
        server = null;
        System.gc();
        if (port == -1) {
            throw new RuntimeException("PrivilegedExecutorServer start error");
        }
        s = new Socket(InetAddress.getLoopbackAddress(), port);
        commandStream = new PrintStream(s.getOutputStream(), true);
        resultStream = new BufferedReader(new InputStreamReader(s.getInputStream()));
    }

    public void executeVolumeMounting(File fs, File mountPoint) throws IOException {
        synchronized (locker) {
            if (s.isClosed()) {
                throw new IllegalStateException("Socket is closed");
            }
            if (!fs.exists() || !mountPoint.exists() || !mountPoint.isDirectory()) {
                throw new FileNotFoundException("Invalid files for mounting");
            }
            commandStream.println(fs.getAbsolutePath() + "\0" + mountPoint.getAbsolutePath());
            int result = Integer.parseInt(resultStream.readLine());
            if (result != 0) {
                throw new RuntimeException("Internal process execution exception");
            }
        }
    }

    public void executeVolumeUmount(File mountPoint) throws IOException {
        synchronized (locker) {
            if (s.isClosed()) {
                throw new IllegalStateException("Socket is closed");
            }
            if (!mountPoint.exists() || !mountPoint.isDirectory()) {
                throw new FileNotFoundException("Invalid point for umounting");
            }
            commandStream.println(mountPoint.getAbsolutePath());
            int result = Integer.parseInt(resultStream.readLine());
            if (result != 0) {
                throw new RuntimeException("Internal process execution exception");
            }
        }
    }
}
