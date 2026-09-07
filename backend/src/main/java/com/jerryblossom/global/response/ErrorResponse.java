package com.jerryblossom.global.response;

import com.jerryblossom.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@RequiredArgsConstructor
public class ErrorResponse {
    private final String code;
    private final String message;
    private final Map<String, String> errors;
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(
                errorCode.name(),
                errorCode.getMessage(),
                Map.of()
        );
    }

    public static ErrorResponse of(
            ErrorCode errorCode,
            Map<String, String> errors
    ) {
        return new ErrorResponse(
                errorCode.name(),
                errorCode.getMessage(),
                errors);
    }
}
