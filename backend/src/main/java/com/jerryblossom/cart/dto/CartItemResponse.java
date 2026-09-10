package com.jerryblossom.cart.dto;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;

@Getter
@Builder
public class CartItemResponse implements Serializable {
    private final Long itemId;
    private final String name;
    private final int unitPrice;
    private final int quantity;
    private final int totalPrice;
    private final String imageUrl;
}
