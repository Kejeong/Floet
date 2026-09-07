package com.jerryblossom.global.config;

import com.jerryblossom.user.domain.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.jerryblossom.global.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/auth/signup",
                "/api/auth/login",
                "/api/auth/reissue",
                "/api/auth/logout",
                "/swagger-ui/**",
                "/v3/api-docs/**").permitAll()
                // 누구나 상품조회 가능
                .requestMatchers(HttpMethod.GET, "/api/items", "/api/items/**")
                .permitAll()
                // 관리자만 상품 등록 가능
                .requestMatchers(HttpMethod.POST, "/api/items")
                .hasRole(Role.ADMIN)
                // 관리자만 상품 수정 가능
                .requestMatchers(HttpMethod.PUT, "/api/items/**")
                .hasRole(Role.ADMIN)
                // 관리자만 상품 삭제 가능
                .requestMatchers(HttpMethod.DELETE, "/api/items/**")
                .hasRole(Role.ADMIN)
                // 나머지 API는 로그인 필요
            .anyRequest().authenticated())
        .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class)

        .exceptionHandling(exception -> exception
            .authenticationEntryPoint(
                (request, response, error) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
        .build();
  }

  /**
   * Cors 설정
   * @return
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(
            List.of("http://localhost:3000")
    );
    configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
    );
    configuration.setAllowedHeaders(
            List.of("Content-Type", "Authorization")
    );
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
  }
}
