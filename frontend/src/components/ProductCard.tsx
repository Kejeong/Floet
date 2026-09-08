import React from 'react';
import { ChevronRight, Flower2 } from 'lucide-react';
import { FlowerItem } from '../types';
import { getItemImageUrl } from '../api/items';

interface ProductCardProps {
  flower: FlowerItem;
  onSelect: (flower: FlowerItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ flower, onSelect }) => {
  const imageUrl = getItemImageUrl(flower.imageUrl ?? flower.image);

  return (
    <div
      id={`product-card-${flower.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-[#E6DDD2] hover:border-[#2C2723]/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-[#EADBCE]/30 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={flower.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#2C2723]/50">
            <Flower2 className="w-11 h-11" />
            <span className="text-xs">상품 이미지 준비 중</span>
          </div>
        )}

        {/* Hover Quick View overlay button */}
        <div className="absolute inset-0 bg-[#2C2723]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
          <button
            onClick={() => onSelect(flower)}
            className="w-full bg-[#2C2723] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-medium py-2.5 rounded-lg shadow-sm hover:bg-[#1C1917] transition-colors cursor-pointer"
          >
            상세보기
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#2C2723]/50 font-light">
            {flower.category.replaceAll('_', ' ')}
          </span>
          <span className="text-[10px] text-[#2C2723]/50">재고 {flower.stock}개</span>
        </div>

        {/* Flower Name */}
        <h3 className="text-sm font-semibold text-[#2C2723] mb-1.5 group-hover:opacity-80 transition-opacity">
          {flower.name}
        </h3>

        {/* Flower Meaning (꽃말) */}
        <div className="bg-[#F6F1EA] rounded-md px-2.5 py-1 mb-2.5 border border-[#E6DDD2]">
          <p className="text-[11px] text-[#2C2723]/80 flex items-center gap-1">
            <span className="font-medium text-[#2C2723] text-[11px]">꽃말:</span>
            <span className="truncate">{flower.flowerMeaning}</span>
          </p>
        </div>

        <p className="text-[11px] text-[#2C2723]/60 font-light line-clamp-1 mb-3">
          {flower.occasionTag}
        </p>

        {/* Price & Action button in footer */}
        <div className="mt-auto pt-3 border-t border-[#E6DDD2] flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-[#2C2723]">
              {flower.price.toLocaleString()}원
            </span>
          </div>

          <button
            id={`btn-order-flower-${flower.id}`}
            onClick={() => onSelect(flower)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#2C2723] border-b border-[#2C2723] pb-0.5 hover:opacity-70 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>주문하기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
