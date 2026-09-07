package com.jerryblossom.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    @Schema(description = "API 요청에 사용할 JWT Access Token")
    private String accessToken;

    @Schema(description = "Access Token 만료까지 남은 시간")
    private long expiresIn;
}
