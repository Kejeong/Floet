package com.jerryblossom.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * 회원가입 결과를 반환
 */
@Getter
@AllArgsConstructor
public class SignUpResponse {
  private Long id;
  private String email;
  private String name;
}
