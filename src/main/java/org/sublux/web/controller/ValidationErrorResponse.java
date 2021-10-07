package org.sublux.web.controller;

import org.sublux.web.form.ValidationError;

import java.util.Set;

public class ValidationErrorResponse {
    private final String message = "VALIDATION_ERROR";
    private Set<ValidationError> errorList;

    public ValidationErrorResponse(Set<ValidationError> errorList) {
        this.errorList = errorList;
    }

    public String getMessage() {
        return message;
    }

    public Set<ValidationError> getErrorList() {
        return errorList;
    }

    public void setErrorList(Set<ValidationError> errorList) {
        this.errorList = errorList;
    }
}
