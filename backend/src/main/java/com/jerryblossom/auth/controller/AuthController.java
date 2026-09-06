package com.jerryblossom.auth.controller;

import com.jerryblossom.auth.dto.LoginRequest;
import com.jerryblossom.auth.dto.LoginResponse;
import com.jerryblossom.auth.dto.SignUpRequest;
import com.jerryblossom.auth.dto.SignUpResponse;
import com.jerryblossom.auth.service.AuthService;
import com.jerryblossom.global.security.TokenPair;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "인증", description = "회원인증")
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     * @param request
     * @return
     */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 이름, 전화번호를 입력해 회원을 생성합니다.")
    public SignUpResponse signUp(@Valid @RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호를 확인한 뒤 토큰을 발급합니다.")
    public LoginResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        TokenPair tokenPair = authService.login(request);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenPair.getRefreshToken())
                .httpOnly(true)
                .secure(true)       // 로컬 HTTP 개발 중에는 false
                .sameSite("Lax")
                .path("/api/auth")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return LoginResponse.builder()
                .accessToken(tokenPair.getAccessToken())
                .expiresIn(tokenPair.getAccessTokenExpiresIn())
                .build();

    }
}
