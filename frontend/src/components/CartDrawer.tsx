import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CustomOrderItem } from '../types';
import { getItemImageUrl } from '../api/items';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CustomOrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const itemsTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FBF9F6] border-l border-[#E6DDD2] shadow-2xl flex flex-col"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E6DDD2] bg-[#FBF9F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#2C2723]" />
              <h2 className="text-sm font-semibold text-[#2C2723]">
                장바구니 ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 text-[#2C2723]/60 hover:text-[#2C2723] hover:bg-[#EFE8DE] rounded-full transition-colors cursor-pointer"
              aria-label="장바구니 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FBF9F6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#2C2723]/60 py-16">
                <div className="w-14 h-14 rounded-full border border-[#E6DDD2] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-[#2C2723]/40" />
                </div>
                <p className="text-sm font-medium text-[#2C2723] mb-1">
                  장바구니가 비어 있습니다
                </p>
                <p className="text-xs text-[#2C2723]/60 max-w-xs font-light leading-relaxed">
                  마음을 전하고 싶은 감성적인 꽃을 담아보세요.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="p-3.5 rounded-xl border border-[#E6DDD2] bg-white flex gap-3.5 relative shadow-xs"
                >
                  {/* Item Thumbnail */}
                  <img
                    src={getItemImageUrl(item.flower.imageUrl ?? item.flower.image)}
                    alt={item.flower.name}
                    className="w-20 h-20 object-cover rounded-lg border border-[#E6DDD2] shrink-0"
                  />

                  {/* Item Spec */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-[#2C2723] truncate">
                          {item.flower.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#2C2723]/40 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          aria-label="상품 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#2C2723]/60 font-light mt-0.5">
                        단가: {item.flower.price.toLocaleString()}원
                      </p>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6DDD2]/60">
                      <div className="flex items-center border border-[#E2D8CC] rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-semibold hover:bg-[#EFE8DE] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs font-semibold hover:bg-[#EFE8DE] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#2C2723]">
                        {item.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E6DDD2] bg-[#FAF8F5] space-y-3">
              <div className="space-y-1.5 text-xs text-[#2C2723]/70 font-light">
                <div className="flex justify-between text-sm font-medium text-[#2C2723] pt-1">
                  <span>총 주문 금액</span>
                  <span className="text-base font-bold text-[#2C2723]">
                    {itemsTotal.toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2C2723] text-[#FBF9F6] hover:bg-[#1C1917] py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm cursor-pointer"
              >
                <span>주문서 작성하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
