package org.sublux.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.sublux.serialization.TestSerializer;
import org.sublux.test.InputOutputType;

import javax.persistence.*;

@Entity
@Table(name = "test")
@JsonSerialize(using = TestSerializer.class)
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "points")
    private int points;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_provider_type")
    private InputOutputType inputProviderType;

    @Lob
    @Column(name = "input")
    private byte[] input;

    @Enumerated(EnumType.STRING)
    @Column(name = "output_consumer_type")
    private InputOutputType outputConsumerTypeId;

    @Lob
    @Column(name = "output")
    private byte[] output;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cluster_id", nullable = false)
    private TestCluster testCluster;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public InputOutputType getInputProviderType() {
        return inputProviderType;
    }

    public void setInputProviderType(InputOutputType inputProviderType) {
        this.inputProviderType = inputProviderType;
    }

    public byte[] getInput() {
        return input;
    }

    public void setInput(byte[] input) {
        this.input = input;
    }

    public InputOutputType getOutputConsumerTypeId() {
        return outputConsumerTypeId;
    }

    public void setOutputConsumerTypeId(InputOutputType outputConsumerTypeId) {
        this.outputConsumerTypeId = outputConsumerTypeId;
    }

    public byte[] getOutput() {
        return output;
    }

    public void setOutput(byte[] output) {
        this.output = output;
    }

    public TestCluster getTestCluster() {
        return testCluster;
    }

    public void setTestCluster(TestCluster testCluster) {
        this.testCluster = testCluster;
    }
}
