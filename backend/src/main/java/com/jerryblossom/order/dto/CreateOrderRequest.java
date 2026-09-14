package com.jerryblossom.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CreateOrderRequest {
    @NotBlank(message = "주문자 이름은 필수입니다.")
    @Size(max = 50, message = "주문자 이름은 50자 이하여야 합니다.")
    private String ordererName;

    @NotBlank(message = "주문자 연락처는 필수입니다.")
    private String ordererPhone;

    @Size(max = 500, message = "주문 요청사항은 500자 이하여야 합니다.")
    private String orderRequest;

    @NotEmpty(message = "주문 상품은 1개 이상이여야 합니다.")
    private List<@Valid CreateOrderItemRequest> items;
}
