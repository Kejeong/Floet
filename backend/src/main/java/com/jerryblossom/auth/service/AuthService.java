package com.jerryblossom.auth.service;

import com.jerryblossom.auth.exception.EmailAlreadyExistsException;
import com.jerryblossom.user.domain.User;
import jakarta.validation.constraints.Email;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

import com.jerryblossom.auth.dto.SignUpRequest;
import com.jerryblossom.auth.dto.SignUpResponse;
import com.jerryblossom.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * 회원가입
   * 
   * @param request
   * @return
   */
  public SignUpResponse signUp(SignUpRequest request) {
    // 이미 등록된 메일이 있는지 검증
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new EmailAlreadyExistsException();
    }

    User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .phoneNumber(request.getPhoneNumber())
            .role("USER")
            .build();

    User savedUser = userRepository.save(user);

    return new SignUpResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getName());
  }
}
