package org.sublux.isolation.privileged;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Arrays;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

class PrivilegedExecutorServer extends Thread {
    private final AtomicInteger port;
    private final CountDownLatch latch;

    public PrivilegedExecutorServer() {
        port = new AtomicInteger(-1);
        latch = new CountDownLatch(1);
        setDaemon(true);
    }

    private char[] getPassword() throws IOException {
        System.out.print("Password for root user [sudo]: ");
        Console c = System.console();
        if (c != null) {
            return c.readPassword();
        } else {
            String password = new BufferedReader(new InputStreamReader(System.in)).readLine();
            return password.toCharArray();
        }
    }

    private Process createRootPrivilegedExecutor() throws IOException {
        ProcessBuilder pb = new ProcessBuilder("sudo", "-p", "", "-S", "--", "bash", "-c", "echo 1 1>&2; while read -sr line; do $line > /dev/null 2>&1; echo $?; done");
        Process p = pb.start();
        PrintStream writer = new PrintStream(p.getOutputStream(), true);
        char[] pass = getPassword();
        writer.print(pass);
        for (int i = 0; i < 100; i++) {
            Arrays.fill(pass, (char) (i % 2));
        }
        System.gc();
        writer.print("\n");
        BufferedReader bf = new BufferedReader(new InputStreamReader(p.getErrorStream()));
        if (!p.isAlive() || !bf.readLine().equals("1")) {
            p.destroyForcibly();
            throw new RuntimeException("Wrong root password");
        }
        return p;
    }

    @Override
    public void run() {
        String username = System.getProperty("user.name");
        Process executor = null;
        try {
            executor = createRootPrivilegedExecutor();
        } catch (IOException | RuntimeException e) {
            e.printStackTrace();
        }
        if (executor == null) {
            latch.countDown();
            port.set(-1);
            return;
        }
        PrintStream executorCommandOutputStream = new PrintStream(executor.getOutputStream(), true);
        BufferedReader executorResultReader = new BufferedReader(new InputStreamReader(executor.getInputStream()));
        ServerSocket ss;
        try {
            ss = new ServerSocket(0, 1);
        } catch (IOException e) {
            e.printStackTrace();
            latch.countDown();
            port.set(-1);
            return;
        }
        port.set(ss.getLocalPort());
        latch.countDown();
        Socket s;
        BufferedReader clientCommandInputStream;
        PrintStream clientResultOutputStream;
        try {
            s = ss.accept();
            clientCommandInputStream = new BufferedReader(new InputStreamReader(s.getInputStream()));
            clientResultOutputStream = new PrintStream(s.getOutputStream(), true);
        } catch (IOException e) {
            e.printStackTrace();
            port.set(-1);
            return;
        }
        try {
            ss.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            for (String request = clientCommandInputStream.readLine(); request != null; request = clientCommandInputStream.readLine()) {
                String[] params = request.split("\u0000");
                if (params.length > 2) {
                    port.set(-1);
                    return;
                }
                switch (params.length) {
                    case 1: {
                        File in = new File(params[0]);
                        if (!in.exists() || !in.isDirectory()) {
                            clientResultOutputStream.println(-1);
                            port.set(-1);
                            return;
                        }
                        executorCommandOutputStream.println("umount " + in);
                        int result = Integer.parseInt(executorResultReader.readLine());
                        if (!executor.isAlive()) {
                            result = -1;
                        }
                        clientResultOutputStream.println(result);
                        if (result != 0) {
                            port.set(-1);
                            return;
                        }
                        break;
                    }
                    case 2: {
                        File in = new File(params[0]);
                        File out = new File(params[1]);
                        if (!in.exists() || !out.exists() || !out.isDirectory()) {
                            clientResultOutputStream.println(-1);
                            port.set(-1);
                            return;
                        }
                        executorCommandOutputStream.println("mount " + in + " " + out);
                        int result = Integer.parseInt(executorResultReader.readLine());
                        if (!isAlive()) {
                            result = -1;
                        }
                        if (result != 0) {
                            clientResultOutputStream.println(result);
                            port.set(-1);
                            return;
                        }
                        executorCommandOutputStream.println("chown " + username + " " + out);
                        result = Integer.parseInt(executorResultReader.readLine());
                        if (!executor.isAlive()) {
                            result = -1;
                        }
                        clientResultOutputStream.println(result);
                        if (result != 0) {
                            port.set(-1);
                            return;
                        }
                        break;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                clientCommandInputStream.close();
                clientResultOutputStream.close();
                executorResultReader.close();
                executorCommandOutputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                s.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {
                ss.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public AtomicInteger getPort() {
        return port;
    }

    public CountDownLatch getLatch() {
        return latch;
    }
}
