package com.jerryblossom.user.dto;

import com.jerryblossom.user.domain.User;
import lombok.Getter;

@Getter
public class UserProfileResponse {
    private final Long id;
    private final String email;
    private final String name;
    private final String phoneNumber;
    private final String role;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
    }
}
