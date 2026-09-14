package com.jerryblossom.order.domain;

import com.jerryblossom.item.domain.Item;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false, length = 100)
    private String itemName;  // 주문 시점의 상품 정보 스냅샷

    @Column(nullable =false)
    private int unitPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int totalPrice;

    private OrderItem(Item item, int quantity) {
        this.item = item;
        this.itemName = item.getName();
        this.unitPrice = item.getPrice();
        this.quantity = quantity;
        this.totalPrice = unitPrice * quantity;
    }

    public static OrderItem create(Item item, int quantity) {
        if(quantity < 1) {
            throw new IllegalArgumentException("주문 수량은 1개 이상이어야 합니다.");
        }
        return new OrderItem(item, quantity);
    }

    void assignOrder(Order order) {
        this.order = order;
    }
}
