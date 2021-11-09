package org.sublux.serialization;

import org.sublux.entity.TestCluster;

public class TestClusterLong extends TestCluster {

    public TestClusterLong(TestCluster cluster) {
        setName(cluster.getName());
        setTask(cluster.getTask());
        setTests(cluster.getTests());
    }
}
