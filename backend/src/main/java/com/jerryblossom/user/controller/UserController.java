package com.jerryblossom.user.controller;

import com.jerryblossom.user.dto.UserProfileResponse;
import com.jerryblossom.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "회원", description = "회원 정보")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회")
    public UserProfileResponse getMyProfile(@AuthenticationPrincipal Long userId) {
        return userService.getMyProfile(userId);
    }
}
