package com.jerryblossom.item.dto;

import com.jerryblossom.item.domain.ItemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ItemCreateRequest {
    @NotBlank(message = "상품명은 필수입니다.")
    private String name;

    @NotNull(message = "카테고리는 필수입니다.")
    private ItemCategory category;

    @NotBlank(message = "꽃말은 필수입니다.")
    private String flowerMeaning;

    @NotBlank(message = "상황 태그는 필수입니다.")
    private String occasionTag;

    @NotBlank(message = "상세설명은 필수입니다.")
    private String itemDtl;

    @Positive(message = "가격은 0보다 커야 합니다.")
    private int price;

    @PositiveOrZero(message = "재고는 0 이상이어야 합니다.")
    private int stock;

    @Size(max = 500, message = "이미지 주소는 500자 이하여야 합니다.")
    private String imageUrl;
}
