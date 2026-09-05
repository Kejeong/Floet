package com.jerryblossom.user.domain;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false)
  private String password;
  @Column(nullable = false)
  private String name;

  private String phoneNumber;
  @Column(nullable = false)
  private String role;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @Builder
  public User(Long id, String email, String password, String name, String phoneNumber, String role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.role = role;
  }

  @PrePersist
  public void onCreate() { // 생성일자를 자동으로 생성
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void onUpdate() { // 수정일자를 자동으로 업데이트
    this.updatedAt = LocalDateTime.now();
  }
}
