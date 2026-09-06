package com.jerryblossom.global.security;

import com.jerryblossom.user.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final SecretKey secretKey;
    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") long accessExpiration,
            @Value("${jwt.refresh-expiration}") long refreshExpiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    /**
     * 토큰생성
     */
    public TokenPair createToken(User user) {
        Instant now = Instant.now();

        String accessToken = Jwts.builder()
                .subject(String.valueOf(user.getId()))  // 이 토큰 주인이 누구인지 사용자 ID를 기록
                .claim("email", user.getEmail())
                .claim("role", user.getRole())  // 권한정보 추가
                .issuedAt(Date.from(now))  // 발급 시각
                .expiration(Date.from(now.plusSeconds(accessExpiration)))  // 이 시각이 지나면 토큰 무효화
                .signWith(secretKey)  // 서버만 아는키로 서명
                .compact();  // JWT 문자열로 완성

        String refreshToken = Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshExpiration)))
                .signWith(secretKey)
                .compact();

        return new TokenPair(accessToken, refreshToken, accessExpiration);
    }
}
