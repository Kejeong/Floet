package com.jerryblossom.order.domain;

import com.jerryblossom.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders" )
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 주문ID

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // 주문한 사용자

    @Column(nullable = false, length = 100)
    private String orderName;  //주문서에 입력한 주문자 정보

    @Column(nullable = false, length = 100)
    private String orderPhone;  // 주문서에 입력한 주문자 전화번호

    @Column(length = 500)
    private String orderRequest;  // 주문요청사항

    @Column(nullable = false)
    private int totalAmount;  // 서버에서 계산한 총 주문금액

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;  // 주문상태

    private LocalDateTime orderedAt;  // 주문시간

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();  // 주문상품

    private Order(User user, String orderName, String orderPhone, String orderRequest) {
        this.user = user;
        this.orderName = orderName;
        this.orderPhone = orderPhone;
        this.orderRequest = orderRequest;
        this.status = OrderStatus.ORDERED;
        this.orderedAt = LocalDateTime.now();
    }

    /**
     * 주문생성
     * @param user
     * @param orderName
     * @param orderPhone
     * @param orderRequest
     * @param orderItems
     * @return
     */
    public static Order create(User user, String orderName, String orderPhone, String orderRequest, List<OrderItem> orderItems) {
        Order order = new Order(user, orderName, orderPhone, orderRequest);

        orderItems.forEach(order::addOrderItem);
        order.calculateTotalAmount();

        return order;
    }

    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
    }

    /**
     * 총 금액 계산
     */
    private void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
    }
}
