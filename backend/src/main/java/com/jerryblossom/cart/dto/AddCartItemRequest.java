package com.jerryblossom.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AddCartItemRequest {
    @NotNull(message = "상품ID는 필수 입니다.")
    private Long itemId;

    @Min(value = 1, message = "수량은 1개 이상이여야 합니다.")
    private int quantity;
}
