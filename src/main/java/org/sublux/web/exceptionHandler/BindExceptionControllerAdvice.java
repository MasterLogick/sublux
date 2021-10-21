package org.sublux.web.exceptionHandler;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.sublux.web.controller.ValidationErrorResponse;
import org.sublux.web.form.ValidationError;

import java.util.HashSet;

@ControllerAdvice
public class BindExceptionControllerAdvice {

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Object> handleBindException(BindException e) {
        ValidationErrorResponse ver = new ValidationErrorResponse(new HashSet<>());
        e.getFieldErrors().forEach(err -> ver.getErrorList().add(new ValidationError(err.getDefaultMessage(), err.getField())));
        e.getGlobalErrors().forEach(err -> ver.getErrorList().add(new ValidationError(err.getDefaultMessage(), "GLOBAL")));
        return ResponseEntity.badRequest().body(ver);
    }
}
