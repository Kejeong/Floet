package com.jerryblossom.item.dto;

import com.jerryblossom.item.domain.Item;
import lombok.Getter;

@Getter
public class ItemResponse {

    private final Long id;
    private final String name;
    private final String category;
    private final String flowerMeaning;
    private final String occasionTag;
    private final int price;
    private final int stock;


    public ItemResponse(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.category = item.getCategory();
        this.flowerMeaning = item.getFlowerMeaning();
        this.occasionTag = item.getOccasionTag();
        this.price = item.getPrice();
        this.stock = item.getStock();
    }
}
