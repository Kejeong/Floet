package com.jerryblossom.order.repository;

import com.jerryblossom.order.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    /**
     * 사용자의 주문내역조회
     * @param orderId
     * @param userId
     * @return
     */
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
}
