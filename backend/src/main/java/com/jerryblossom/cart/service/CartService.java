package com.jerryblossom.cart.service;

import com.jerryblossom.cart.domain.CartItem;
import com.jerryblossom.cart.dto.AddCartItemRequest;
import com.jerryblossom.cart.dto.CartItemResponse;
import com.jerryblossom.cart.dto.CartResponse;
import com.jerryblossom.cart.repository.CartItemRepository;
import com.jerryblossom.item.domain.Item;
import com.jerryblossom.item.repository.ItemRepository;
import com.jerryblossom.user.domain.User;
import com.jerryblossom.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    /**
     * 장바구니 조회
     * @param userId
     * @return
     */
    @Cacheable(cacheNames = "cart", key = "#userId")  // Redis 캐시에서 먼저 userId 기준 장바구니를 찾고 캐시가 있으면 DB를 조회하지 않고 그대로 반환한다.
    public CartResponse getCart(Long userId) {
        return buildCartResponse(userId);
    }

    /**
     * 장바구니 추가
     * @param userId
     * @param request
     * @return
     */
    @Transactional
    @CacheEvict(cacheNames = "cart", key = "#userId")  // DB변경이 성공한 뒤, 해당 사용자의 Redis 장바구니 캐시를 제거함 다음 조회에는 최신 DB값을 다시 캐시함
    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        // 요청한 상품이 DB에 있는지 확인
        Item item = findItem(request.getItemId());
        // JWT에서 받은 사용자 ID가 실제 사용자와 일치하는지 확인
        User user = findUser(userId);
        // 같은 사용자가 같은 상품을 이미 장바구니에 담았는지 확인
        CartItem cartItem = cartItemRepository.findByUserIdAndItemId(userId, item.getId()).orElse(null);
        // 기존 장바구니 수량과 새 요청 수량을 합산
        int newQuantity = cartItem == null ? request.getQuantity() : cartItem.getQuantity() + request.getQuantity();

        // 합산수량이 현재 상품 재고를 넘는지 확인
        validateStock(item, newQuantity);

        // 기존 장바구니에 항목이 없으면 새로 추가
        if (cartItem == null) {
            cartItemRepository.save(new CartItem(user, item, newQuantity));
        } else {  // 있으면 재고만 증가
            cartItem.increaseQuantity(request.getQuantity());  // 재고증가
        }

        return buildCartResponse(userId);
    }

    /**
     * 장바구니 수정
     * @param userId
     * @param itemId
     * @param quantity
     * @return
     */
    @Transactional
    @CacheEvict(cacheNames = "cart", key = "#userId")
    public CartResponse updateQuantity(Long userId, Long itemId, int quantity) {
        Item item = findItem(itemId);
        validateStock(item, quantity);

        CartItem cartItem = cartItemRepository.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니에 없는 상품입니다."));

        cartItem.changeQuantity(quantity);

        return buildCartResponse(userId);
    }

    /**
     * 장바구니 상품 삭제
     * @param userId
     * @param itemId
     */
    @Transactional
    @CacheEvict(cacheNames = "cart", key = "#userId")
    public void removeItem(Long userId, Long itemId) {
        CartItem cartItem = cartItemRepository.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니에 없는 상품입니다."));

        cartItemRepository.delete(cartItem);
    }

    /**
     * 장바구니 초기화
     * @param userId
     */
    @Transactional
    @CacheEvict(cacheNames = "cart", key = "#userId")
    public void clearCart(Long userId) {
        cartItemRepository.deleteAllByUserId(userId);
    }

    /**
     * 장바구니 상품
     * @param userId
     * @return
     */
    private CartResponse buildCartResponse(Long userId) {
        List<CartItemResponse> items = cartItemRepository.findAllByUserId(userId)
                .stream()  // 목록을 변환하고 합산
                .map(cartItem -> {
                    Item item = cartItem.getItem();
                    int totalPrice = item.getPrice() * cartItem.getQuantity();

                    return CartItemResponse.builder()
                            .itemId(item.getId())
                            .name(item.getName())
                            .unitPrice(item.getPrice())
                            .quantity(cartItem.getQuantity())
                            .totalPrice(totalPrice)
                            .imageUrl(item.getImageUrl())
                            .build();
                })
                .toList();

        int totalAmount = items.stream()
                .mapToInt(CartItemResponse::getTotalPrice)
                .sum();

        return CartResponse.builder()
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }

    /**
     * 상품조회
     * @param itemId
     * @return
     */
    private Item findItem(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
    }

    /**
     * 사용자 조회
     * @param userId
     * @return
     */
    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    /**
     * 재고 검증
     * @param item
     * @param quantity
     */
    private void validateStock(Item item, int quantity) {
        if (quantity > item.getStock()) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
    }
}