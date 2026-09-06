package com.jerryblossom.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jerryblossom.user.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> { // 저장, ID조회, 전체 조회 등 기본 기능을 자동으로 제공
  boolean existsByEmail(String email); // 이메일 중복 체크

  /**
   * 이메일 조회
   */
  Optional<User> findByEmail(String email);
}
