package com.jerryblossom.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redisTemplate;

    public void save(Long userId, String refreshToken) {
        // Redis에 refresh:{userId} 키로 저장
    }
    public boolean matches(Long userId, String refreshToken) {
        // Redis에 저장된 해시와 전달받은 토큰 해시 비교
        return false;
    }
    public void delete(Long userId) {
        //로그아웃 시 Redis 키 삭제
    }
}
