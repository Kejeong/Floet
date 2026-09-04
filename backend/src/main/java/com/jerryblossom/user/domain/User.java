package com.jerryblossom.user.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue
  private Long id;
  @NotEmpty
  private String email;
  private String password;
  private String name;
  private String phoneNumber;
  private String role;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @Builder
  public User(Long id, String email, String password, String name, String phoneNumber, String role,
      LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
