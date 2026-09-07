package com.jerryblossom.global.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TokenPair {
    private final String accessToken;
    private final String refreshToken;
    private final long accessTokenExpiresIn;  // accessToken 만료시간
    private final long refreshTokenExpiresIn;  // refreshToken 만료시간
}
