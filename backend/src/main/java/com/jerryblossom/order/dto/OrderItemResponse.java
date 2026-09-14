package com.jerryblossom.order.dto;

import com.jerryblossom.order.domain.OrderItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemResponse {
    private Long itemId;
    private String itemName;
    private int unitPrice;
    private int quantity;
    private int totalPrice;

    /**
     * 주문상품 응답 DTO
     * @param orderItem
     * @return
     */
    public static OrderItemResponse from(OrderItem orderItem) {
        return OrderItemResponse.builder()
                .itemId(orderItem.getItem().getId())
                .itemName(orderItem.getItemName())
                .unitPrice(orderItem.getUnitPrice())
                .quantity(orderItem.getQuantity())
                .totalPrice(orderItem.getTotalPrice())
                .build();
    }
}
