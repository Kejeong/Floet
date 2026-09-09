package com.jerryblossom.item.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private String flowerMeaning;

    @Column(nullable = false, length = 50)
    private String occasionTag;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int stock;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Builder
    public Item(String name, String category, String flowerMeaning, String occasionTag, int price, int stock, String imageUrl) {
        this.name = name;
        this.category = category;
        this.flowerMeaning = flowerMeaning;
        this.occasionTag = occasionTag;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
    }

    /**
     * 상품 수정
     */
    public void update(String name, String category, String flowerMeaning, String occasionTag, int price, int stock) {
        this.name = name;
        this.category = category;
        this.flowerMeaning = flowerMeaning;
        this.occasionTag = occasionTag;
        this.price = price;
        this.stock = stock;
    }
    /**
     * 상품 이미지 변경
     */
    public void changeImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
