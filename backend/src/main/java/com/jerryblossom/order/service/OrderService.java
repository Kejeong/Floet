package com.jerryblossom.order.service;

import com.jerryblossom.item.domain.Item;
import com.jerryblossom.item.repository.ItemRepository;
import com.jerryblossom.order.domain.Order;
import com.jerryblossom.order.domain.OrderItem;
import com.jerryblossom.order.dto.CreateOrderItemRequest;
import com.jerryblossom.order.dto.CreateOrderRequest;
import com.jerryblossom.order.dto.OrderResponse;
import com.jerryblossom.order.repository.OrderRepository;
import com.jerryblossom.user.domain.User;
import com.jerryblossom.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    /**
     * 주문등록
     * @param userId
     * @param request
     * @return
     */
    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<OrderItem> orderItems = request.getItems()
                .stream()
                .map(this::createOrderItem)
                .toList();

        Order order = Order.create(user, request.getOrdererName(), request.getOrdererPhone(), request.getOrderRequest(), orderItems);
        Order savedOrder = orderRepository.save(order);

        return OrderResponse.from(savedOrder);
    }

    private OrderItem createOrderItem(CreateOrderItemRequest request) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        return OrderItem.create(item, request.getQuantity());
    }
}
