package org.sublux.isolation;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Service
public class DockerTasksThreadPool extends ThreadPoolExecutor {

    public DockerTasksThreadPool(Environment env) {
        super(0, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>());
        int poolSize = env.getProperty("sublux.docker-pool-size", Integer.class, 1);
        setCorePoolSize(poolSize);
        setMaximumPoolSize(poolSize);
    }
}
