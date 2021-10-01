package org.sublux.controller;

public class ApiResponse {
    public static final ApiResponse OK = new ApiResponse(0, "OK");
    private final Integer code;
    private final String reason;

    public ApiResponse(Integer code, String reason) {
        this.code = code;
        this.reason = reason;
    }

    public Integer getCode() {
        return code;
    }

    public String getReason() {
        return reason;
    }
}
