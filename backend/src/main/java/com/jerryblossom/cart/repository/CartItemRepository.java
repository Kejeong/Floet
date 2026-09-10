package com.jerryblossom.cart.repository;

import com.jerryblossom.cart.domain.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @EntityGraph(attributePaths = "item")  // 장바구니 목록을 조회할 때 상품을 한꺼번에 가져와 N+1 조회를 줄여준다.
    List<CartItem> findAllByUserId(Long userId);

    Optional<CartItem> findByUserIdAndItemId(Long userId, Long itemId);

    void deleteAllByUserId(Long userId);
}
