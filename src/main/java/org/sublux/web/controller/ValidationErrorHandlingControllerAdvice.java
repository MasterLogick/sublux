package org.sublux.web.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.sublux.web.form.ValidationError;

import java.util.ArrayList;

@ControllerAdvice
public class ValidationErrorHandlingControllerAdvice extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleBindException(BindException e, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ValidationErrorResponse ver = new ValidationErrorResponse(new ArrayList<>());
        e.getAllErrors().forEach(err -> ver.getErrorList().add(new ValidationError(err.getDefaultMessage(), err.getObjectName())));
        return ResponseEntity.badRequest().body(ver);
    }
}
