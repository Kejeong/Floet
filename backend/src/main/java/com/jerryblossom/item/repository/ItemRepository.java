package com.jerryblossom.item.repository;

import com.jerryblossom.item.domain.Item;
import com.jerryblossom.item.domain.ItemCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Long> {
    @Query("""
        select i
        from Item i
        where (:category is null or i.category = :category)
          and (:occasionTag is null or i.occasionTag = :occasionTag)
          and (:keyword = '' or lower(i.name) like lower(concat('%', :keyword, '%'))
      )
    """)
    /**
     * 검색조건에 따른 상품조회
     */
    Page<Item> findAllByFilters(
            @Param("keyword") String keyword,
            @Param("category") ItemCategory category,
            @Param("occasionTag") String occasionTag,
            Pageable pageable
    );
}
