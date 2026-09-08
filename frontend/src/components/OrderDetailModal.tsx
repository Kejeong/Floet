import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Flower2 } from 'lucide-react';
import { FlowerItem, CustomOrderItem } from '../types';
import { getItemImageUrl } from '../api/items';

interface OrderDetailModalProps {
  flower: FlowerItem | null;
  onClose: () => void;
  onAddToCart: (item: CustomOrderItem) => void;
  onInstantOrder: (item: CustomOrderItem) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  flower,
  onClose,
  onAddToCart,
  onInstantOrder,
}) => {
  if (!flower) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const imageUrl = getItemImageUrl(flower.imageUrl ?? flower.image);

  const totalPrice = flower.price * quantity;

  const handleBuildOrderItem = (): CustomOrderItem => {
    return {
      id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      flower,
      size: 'regular',
      sizePriceDiff: 0,
      packaging: 'kraft',
      packagingPrice: 0,
      cardType: 'none',
      cardPrice: 0,
      cardMessage: '',
      deliveryDate: '',
      deliveryTimeSlot: '',
      quantity,
      totalPrice,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        id="flower-order-detail-modal"
        className="relative bg-[#FBF9F6] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E6DDD2] overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DDD2] bg-[#FBF9F6]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2C2723]/50 block font-light">
              Jerry Blossom Floral Order
            </span>
            <h2 className="text-base font-semibold text-[#2C2723]">
              {flower.name}
            </h2>
          </div>
          <button
            id="close-order-modal-btn"
            onClick={onClose}
            className="p-2 text-[#2C2723]/60 hover:text-[#2C2723] hover:bg-[#EFE8DE] rounded-full transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm bg-[#FBF9F6]">
          {/* Flower Visual & Intro */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pb-5 border-b border-[#E6DDD2]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={flower.name}
                className="w-full sm:w-44 h-52 sm:h-44 object-cover rounded-xl border border-[#E6DDD2]"
              />
            ) : (
              <div className="w-full sm:w-44 h-52 sm:h-44 rounded-xl border border-[#E6DDD2] bg-[#F6F1EA] flex items-center justify-center text-[#2C2723]/50">
                <Flower2 className="w-11 h-11" />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E0D6C8] text-[#2C2723] font-light bg-white/60">
                    {flower.category.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-[#2C2723]/70 mb-3 font-light leading-relaxed">
                  {flower.occasionTag}에 어울리는 상품입니다.
                </p>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E6DDD2] text-xs text-[#2C2723]">
                  <span className="font-medium text-[#2C2723] text-[11px] mr-1">꽃말:</span>
                  <span className="font-light">{flower.flowerMeaning}</span>
                </div>
                <p className="text-[11px] text-[#2C2723]/60 mt-2 font-light">
                  <span className="font-medium text-[#2C2723]">재고:</span> {flower.stock}개
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DDD2]/60 flex items-baseline gap-2">
                <span className="text-[11px] text-[#2C2723]/50 font-light">판매가</span>
                <span className="text-xl font-bold text-[#2C2723]">
                  {flower.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-medium text-[#2C2723] block">주문 수량</span>
              <span className="text-[11px] text-[#2C2723]/50 font-light">필요한 수량을 선택해주세요</span>
            </div>
            <div className="flex items-center border border-[#E2D8CC] rounded-lg bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-[#2C2723] hover:bg-[#EFE8DE] transition-colors cursor-pointer"
                aria-label="수량 감소"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-semibold font-mono text-[#2C2723]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-[#2C2723] hover:bg-[#EFE8DE] transition-colors cursor-pointer"
                aria-label="수량 증가"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E6DDD2] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#2C2723]/60 font-light">총 주문 금액</span>
            <span className="text-lg sm:text-xl font-bold text-[#2C2723]">
              {totalPrice.toLocaleString()}
              <span className="text-xs font-normal text-[#2C2723]/70 ml-1">원</span>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="add-to-cart-btn"
              onClick={() => {
                onAddToCart(handleBuildOrderItem());
                onClose();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-[#2C2723] hover:bg-[#EFE8DE] border border-[#E2D8CC] px-5 py-3 rounded-xl text-xs uppercase tracking-[0.15em] font-medium transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>장바구니 담기</span>
            </button>

            <button
              id="instant-order-btn"
              onClick={() => {
                const item = handleBuildOrderItem();
                onInstantOrder(item);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#2C2723] text-[#FBF9F6] hover:bg-[#1C1917] px-6 py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm cursor-pointer"
            >
              <span>주문서 바로작성</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
