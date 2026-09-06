package com.jerryblossom.auth.service;

import com.jerryblossom.auth.dto.LoginRequest;
import com.jerryblossom.auth.exception.EmailAlreadyExistsException;
import com.jerryblossom.auth.exception.InvalidCredentialsException;
import com.jerryblossom.global.security.JwtTokenProvider;
import com.jerryblossom.global.security.TokenPair;
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
  private final JwtTokenProvider jwtTokenProvider;
  private final RefreshTokenService refreshTokenService;

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

  /**
   * 로그인
   */
  public TokenPair login(LoginRequest request){
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

    if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new InvalidCredentialsException();
    }

    TokenPair tokenPair = jwtTokenProvider.createToken(user);
    // 다음 단계: refresh:{userId}에 refreshToken의 해시를 TTL과 함께 Redis 저장
    refreshTokenService.save(user.getId(), tokenPair.getRefreshToken());

    return tokenPair;
  }
}
