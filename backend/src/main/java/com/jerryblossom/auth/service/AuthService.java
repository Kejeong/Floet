package com.jerryblossom.auth.service;

import com.jerryblossom.auth.dto.LoginRequest;
import com.jerryblossom.auth.exception.EmailAlreadyExistsException;
import com.jerryblossom.auth.exception.InvalidCredentialsException;
import com.jerryblossom.auth.exception.InvalidTokenException;
import com.jerryblossom.global.security.JwtTokenProvider;
import com.jerryblossom.global.security.TokenPair;
import com.jerryblossom.user.domain.User;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.jerryblossom.auth.dto.SignUpRequest;
import com.jerryblossom.auth.dto.SignUpResponse;
import com.jerryblossom.user.repository.UserRepository;

import io.jsonwebtoken.Claims;

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
   * @param request
   * @return SignUpResponse
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
   *
   * @param request
   * @return TokenPair
   */
  public TokenPair login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(InvalidCredentialsException::new);

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new InvalidCredentialsException();
    }

    TokenPair tokenPair = jwtTokenProvider.createToken(user);
    // 다음 단계: refresh:{userId}에 refreshToken의 해시를 TTL과 함께 Redis 저장
    refreshTokenService.save(user.getId(), tokenPair.getRefreshToken());

    return tokenPair;
  }

  /**
   * Refresh Token 재발급
   * 
   * @param refreshToken Refresh Token
   * @return TokenPair
   */
  public TokenPair reissue(String refreshToken) {
    Claims claims = jwtTokenProvider.parseRefreshToken(refreshToken);
    Long userId = Long.valueOf(claims.getSubject());

    if (!refreshTokenService.consume(userId, refreshToken)) {
      throw new InvalidTokenException();
    }

    User user = userRepository.findById(userId)
        .orElseThrow(InvalidTokenException::new);

    TokenPair newTokens = jwtTokenProvider.createToken(user);
    refreshTokenService.save(userId, newTokens.getRefreshToken());

    return newTokens;
  }

  /**
   * 로그아웃
   */
  public void logout(String refreshToken) {
    try{
      Claims claims = jwtTokenProvider.parseRefreshToken(refreshToken);
      Long userId = Long.valueOf(claims.getSubject());

      refreshTokenService.deleteIfMatches(userId, refreshToken);
    } catch (JwtException | InvalidTokenException | IllegalArgumentException ignored) {
      // 이미 만료,삭제,변조된 토큰이어도 쿠키는 제거한다.
    }
  }

}
