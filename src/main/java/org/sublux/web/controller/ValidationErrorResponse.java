package org.sublux.web.controller;

import org.sublux.web.form.ValidationError;

import java.util.List;

public class ValidationErrorResponse {
    private final String message = "VALIDATION_ERROR";
    private List<ValidationError> errorList;

    public ValidationErrorResponse(List<ValidationError> errorList) {
        this.errorList = errorList;
    }

    public String getMessage() {
        return message;
    }

    public List<ValidationError> getErrorList() {
        return errorList;
    }

    public void setErrorList(List<ValidationError> errorList) {
        this.errorList = errorList;
    }
}
