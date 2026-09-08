package com.jerryblossom.item.service;

import com.jerryblossom.item.domain.Item;
import com.jerryblossom.item.dto.ItemCreateRequest;
import com.jerryblossom.item.dto.ItemResponse;
import com.jerryblossom.item.dto.ItemUpdateRequest;
import com.jerryblossom.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    /**
     * 상품 등록
     * @param request
     * @return
     */
    @Transactional
    @CacheEvict(cacheNames = {"itemList", "item"}, allEntries = true)
    public ItemResponse create(ItemCreateRequest request){
        Item item = Item.builder()
                .name(request.getName())
                .category(request.getCategory())
                .flowerMeaning(request.getFlowerMeaning())
                .occasionTag(request.getOccasionTag())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();

        return new ItemResponse(itemRepository.save(item));
    }

    /**
     * 상품 목록조회
     */
        @Cacheable(
                cacheNames = "itemList",
                key = "#category + ':' + #pageable.pageNumber + ':' + #pageable.pageSize"
        )
        public Page<ItemResponse> findAll(String category, Pageable pageable){
            // Redis에 데이터가 없을 때만 DB조회
        Page<Item> items;

        if(category == null || category.isBlank()) {
            items = itemRepository.findAll(pageable);
        } else {
            items = itemRepository.findAllByCategory(category, pageable);
        }

        return items.map(ItemResponse::new);
    }

    /**
     * 상품 상세조회
     */
    @Cacheable(cacheNames = "item", key = "#id")
    public ItemResponse findById(Long id){
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        return new ItemResponse(item);
    }
    /**
     * 상품 수정
     */
    @Transactional
    @CacheEvict(cacheNames = {"itemList", "item"}, allEntries = true)
    public ItemResponse update(Long id, ItemUpdateRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        item.update(
                request.getName(),
                request.getCategory(),
                request.getFlowerMeaning(),
                request.getOccasionTag(),
                request.getPrice(),
                request.getStock()
        );
        item.changeImageUrl(request.getImageUrl());

        // JPA 변경 감지: save()를 다시 호출하지 않아도 트랜잭션 종료 시 UPDATE 됩니다.
        return new ItemResponse(item);
    }

    /**
     * 상품 삭제
     */
    @Transactional
    @CacheEvict(cacheNames = {"itemList", "item"}, allEntries = true)
    public void delete(Long id){
        itemRepository.deleteById(id);
    }
}
