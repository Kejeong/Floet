package com.jerryblossom.cart.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateCartItemRequest {
    @Min(value = 1, message = "수량은 1개 이상이여야 합니다")
    private int quantity;
}
