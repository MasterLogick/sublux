package org.sublux.service;

public class UserAlreadyExistsException extends Exception {
    public UserAlreadyExistsException(String s) {
        super(s);
    }
}
