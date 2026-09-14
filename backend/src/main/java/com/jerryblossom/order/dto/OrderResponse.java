package com.jerryblossom.order.dto;

import com.jerryblossom.order.domain.Order;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {
    private Long orderId;
    private String status;
    private String ordererName;
    private String ordererPhone;
    private String orderRequest;
    private int totalAmount;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> items;

    /**
     * 주문 DTO
     * @param order
     * @return
     */
    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus().name())
                .ordererName(order.getOrderName())
                .ordererPhone(order.getOrderPhone())
                .orderRequest(order.getOrderRequest())
                .totalAmount(order.getTotalAmount())
                .orderedAt(order.getOrderedAt())
                .items(order.getOrderItems().stream()
                        .map(OrderItemResponse::from)
                        .toList())
                .build();
    }
}
