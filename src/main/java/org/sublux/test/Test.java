package org.sublux.test;

import org.sublux.Task;

import javax.persistence.*;

@Entity
@Table(name = "test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_provider_type")
    private InputOutputType inputProviderType;

    @Column(name = "input_provider_args_id")
    private Long inputProviderArguments;

    @Enumerated(EnumType.STRING)
    @Column(name = "output_consumer_type")
    private InputOutputType outputConsumerTypeId;

    @Column(name = "output_consumer_args_id")
    private Long outputConsumerArgumentsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InputOutputType getInputProviderType() {
        return inputProviderType;
    }

    public void setInputProviderType(InputOutputType inputProviderType) {
        this.inputProviderType = inputProviderType;
    }

    public Long getInputProviderArguments() {
        return inputProviderArguments;
    }

    public void setInputProviderArguments(Long inputProviderArguments) {
        this.inputProviderArguments = inputProviderArguments;
    }

    public InputOutputType getOutputConsumerTypeId() {
        return outputConsumerTypeId;
    }

    public void setOutputConsumerTypeId(InputOutputType outputConsumerTypeId) {
        this.outputConsumerTypeId = outputConsumerTypeId;
    }

    public Long getOutputConsumerArgumentsId() {
        return outputConsumerArgumentsId;
    }

    public void setOutputConsumerArgumentsId(Long outputConsumerArgumentsId) {
        this.outputConsumerArgumentsId = outputConsumerArgumentsId;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
