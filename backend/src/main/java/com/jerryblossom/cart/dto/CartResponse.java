package com.jerryblossom.cart.dto;

import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.util.List;

@Getter
@Builder
public class CartResponse implements Serializable {
    private final List<CartItemResponse> items;
    private final int totalAmount;
}
