package com.jerryblossom.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회원가입 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
public class SignUpRequest {
  @Schema(description = "이메일")
  @NotBlank(message = "이메일은 필수입니다.")
  @Email(message = "올바른 이메일 형식이 아닙니다.")
  private String email;

  @Schema(description = "비밀번호")
  @NotBlank(message = "비밀번호는 필수입니다.")
  @Size(min = 4, max = 20, message = "비밀번호는 8자 이상 64자 이하여야 합니다.")
  private String password;

  @Schema(description = "이름")
  @NotBlank(message = "이름은 필수입니다.")
  @Size(max = 20, message = "이름은 20자 이하여야 합니다.")
  private String name;

  private String phoneNumber;
}