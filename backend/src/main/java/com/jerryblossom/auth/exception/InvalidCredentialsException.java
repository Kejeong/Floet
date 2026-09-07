package com.jerryblossom.auth.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("이메일이나 비밀번호가 일치하지 않습니다.");
    }
}
