package org.sublux.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;
import java.io.InputStreamReader;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class NoHandlerFoundControllerAdvice extends ResponseEntityExceptionHandler {
    @Value("classpath:/static/index.html")
    private Resource index;
    private String data = null;

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        if (data == null) {
            try {
                data = FileCopyUtils.copyToString(new InputStreamReader(index.getInputStream()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        try {
            return ResponseEntity.status(HttpStatus.OK).contentLength(index.contentLength()).contentType(MediaType.TEXT_HTML).body(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ResponseEntity.internalServerError().build();
    }
}
