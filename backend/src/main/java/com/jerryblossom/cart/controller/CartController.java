package com.jerryblossom.cart.controller;

import com.jerryblossom.cart.dto.AddCartItemRequest;
import com.jerryblossom.cart.dto.CartResponse;
import com.jerryblossom.cart.dto.UpdateCartItemRequest;
import com.jerryblossom.cart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController  // 반환객체를 JSON으로 변환해주는 API Controller
@RequiredArgsConstructor  // Lombok이 final 필드를 받는 생성자를 자동 생성하여 Spring이 주입
@RequestMapping("/api/cart")
@Tag(name = "장바구니")
public class CartController {
    private final CartService cartService;

    /**
     * 장바구니 조회
     * @param userId
     * @return
     */
    @GetMapping
    @Operation(summary = "장바구니 조회")
    public CartResponse getCart(@AuthenticationPrincipal Long userId) {  // JWT 인증 필터가 넣어 둔 로그인 사용자 ID
        return cartService.getCart(userId);
    }

    /**
     * 장바구니 추가
     * @param userId
     * @param request
     * @return
     */
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)  // 성공시 HTTP 201을 반환
    @Operation(summary = "장바구니 추가")
    public CartResponse addItem(@AuthenticationPrincipal Long userId,
                                @Valid @RequestBody AddCartItemRequest request) {  // json형태로 들어온 요청을 AddCartItemRequest 객체로 변환
        return cartService.addItem(userId, request);
    }

    /**
     * 장바구니 수정
     * @param userId
     * @param itemId
     * @param request
     * @return
     */
    @PatchMapping("/items/{itemId}")
    @Operation(summary = "장바구니 수정")
    public CartResponse updateQuantity(@AuthenticationPrincipal Long userId,
                                       @PathVariable Long itemId,  // URL의 {itemId}를 받음
                                       @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateQuantity(userId, itemId, request.getQuantity());
    }

    /**
     * 장바구니 상품 삭제
     * @param userId
     * @param itemId
     */
    @DeleteMapping("/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "장바구니 상품 삭제")
    public void removeItem(@AuthenticationPrincipal Long userId, @PathVariable Long itemId) {
        cartService.removeItem(userId, itemId);
    }

    /**
     * 장바구니 초기화
     * @param userId
     */
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "장바구니 초기화")
    public void clearCart(@AuthenticationPrincipal Long userId) {
        cartService.clearCart(userId);
    }
}
