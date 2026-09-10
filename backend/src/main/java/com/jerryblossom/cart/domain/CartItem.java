package com.jerryblossom.cart.domain;

import com.jerryblossom.item.domain.Item;
import com.jerryblossom.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "cart_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_cart_items_user_item", columnNames = {"user_id", "item_id"})
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private int quantity;

    public CartItem(User user, Item item, int quantity) {
        this.user = user;
        this.item = item;
        this.quantity = quantity;
    }

    public void increaseQuantity(int quantity) {
        this.quantity += quantity;
    }

    public void changeQuantity(int quantity) {
        this.quantity = quantity;
    }
}