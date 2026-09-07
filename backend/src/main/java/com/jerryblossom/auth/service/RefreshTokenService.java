package com.jerryblossom.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;

@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";
    private static final DefaultRedisScript<Long> CONSUME_SCRIPT = new DefaultRedisScript<>(
            """
                    local stored = redis.call('GET', KEYS[1])
                    if not stored or stored ~= ARGV[1] then
                      return 0
                    end
                    redis.call('DEL', KEYS[1])
                    return 1
                    """,
            Long.class);
    private static final DefaultRedisScript<Long> DELETE_IF_MATCHES_SCRIPT =
            new DefaultRedisScript<>(
                    """
                    local stored = redis.call('GET', KEYS[1])
                    if not stored or stored ~= ARGV[1] then
                      return 0
                    end
                    redis.call('DEL', KEYS[1])
                    return 1
                    """,
                    Long.class
            );
    private final StringRedisTemplate redisTemplate;
    private final long refreshExpiration;

    public RefreshTokenService(StringRedisTemplate redisTemplate,
            @Value("${jwt.refresh-expiration}") long refreshExpiration) {
        this.redisTemplate = redisTemplate;
        this.refreshExpiration = refreshExpiration;
    }

    /**
     * Refresh Token을 Redis에 저장합니다.
     * 
     * @param userId       사용자 ID
     * @param refreshToken Refresh Token
     */
    public void save(Long userId, String refreshToken) {
        redisTemplate.opsForValue().set(
                key(userId),
                hash(refreshToken),
                Duration.ofSeconds(refreshExpiration));
    }

    /**
     * 토큰 재발급 시 한 번만 성공한다.
     * @param userId
     * @param refreshToken
     */
    public boolean consume(Long userId, String refreshToken) {
        Long result = redisTemplate.execute(
                CONSUME_SCRIPT,
                List.of(key(userId)),
                hash(refreshToken));
        return Long.valueOf(1L).equals(result);
    }

    // 이전 로그인 요청의 logout이 새 세션을 지우지 않도록 토큰 일치 시에만 삭제한다.
    public boolean deleteIfMatches(Long userId, String refreshToken) {
        Long result = redisTemplate.execute(
                DELETE_IF_MATCHES_SCRIPT,
                List.of(key(userId)),
                hash(refreshToken)
        );

        return Long.valueOf(1L).equals(result);
    }

    /**
     * Redis 키를 생성합니다.
     * 
     * @param userId 사용자 ID
     * @return Redis 키
     */
    private String key(Long userId) {
        return KEY_PREFIX + userId;
    }

    /**
     * Refresh Token을 해시합니다.
     * 
     * @param value Refresh Token
     * @return 해시된 Refresh Token
     */
    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256을 사용할 수 없습니다.", exception);
        }
    }
}
