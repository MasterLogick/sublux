package org.sublux.web.exceptionHandler;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.io.IOException;
import java.io.InputStreamReader;

@ControllerAdvice
public class NoHandlerFoundExceptionControllerAdvice {
    @Value("classpath:/static/index.html")
    private Resource index;
    private String data = null;

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex) {
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
