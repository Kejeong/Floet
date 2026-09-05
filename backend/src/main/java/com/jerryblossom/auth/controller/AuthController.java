package com.jerryblossom.auth.controller;

import com.jerryblossom.auth.dto.SignUpRequest;
import com.jerryblossom.auth.dto.SignUpResponse;
import com.jerryblossom.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
}
