package org.sublux.isolation;

public class BuildReport {
    private final State state;
    private final String additionalMessage;

    public BuildReport(State state, String additionalMessage) {
        this.state = state;
        this.additionalMessage = additionalMessage;
    }

    public State getState() {
        return state;
    }

    public String getAdditionalMessage() {
        return additionalMessage;
    }

    public enum State {
        SUCCESS, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, VOLUME_QUOTA_EXCEEDED, RUNTIME_EXCEPTION
    }
}
