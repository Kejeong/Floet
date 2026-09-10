package com.jerryblossom.item.controller;

import com.jerryblossom.item.dto.ItemCreateRequest;
import com.jerryblossom.item.dto.ItemResponse;
import com.jerryblossom.item.dto.ItemUpdateRequest;
import com.jerryblossom.item.domain.ItemCategory;
import com.jerryblossom.item.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
@Tag(name = "상품관리")
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "상품등록")
    public ItemResponse create(@Valid @RequestBody ItemCreateRequest request) {
        return itemService.create(request);
    }

    @GetMapping
    @Operation(summary = "상품목록조회")
    public Page<ItemResponse> findAll(@RequestParam(required = false) String keyword,
                                      @RequestParam(required = false) ItemCategory category,
                                      @RequestParam(required = false) String occasionTag,
                                      @PageableDefault(size = 8, sort= "id", direction = Sort.Direction.DESC) Pageable pageable){
        return itemService.findAll(keyword, category, occasionTag, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "상품상세조회")
    public ItemResponse findById(@PathVariable Long id) {
        return itemService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품수정")
    public ItemResponse update(@PathVariable Long id, @Valid @RequestBody ItemUpdateRequest request) {
        return itemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "상품삭제")
    public void delete(@PathVariable Long id) {
        itemService.delete(id);
    }
}
