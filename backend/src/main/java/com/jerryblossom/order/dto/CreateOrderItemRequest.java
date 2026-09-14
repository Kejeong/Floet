package com.jerryblossom.order.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CreateOrderItemRequest {
    @NotNull(message = "상품 ID는 필수입니다.")
    @Positive(message = "상품 ID는 양수여야 합니다")
    private Long itemId;

    @NotNull(message = "상품 수량은 필수입니다.")
    @Positive(message = "상품 수량은 1개 이상이어야 합니다.")
    private Integer quantity;
}
