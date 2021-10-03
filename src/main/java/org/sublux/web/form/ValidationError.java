package org.sublux.web.form;

public class ValidationError {
    private String message;
    private String objectName;

    public ValidationError(String message, String objectName) {
        this.message = message;
        this.objectName = objectName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }
}
