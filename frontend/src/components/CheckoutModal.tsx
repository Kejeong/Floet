import React, { useState } from 'react';
import { X, ShieldCheck, User, FileText } from 'lucide-react';
import { CustomOrderItem, OrderCheckoutData } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CustomOrderItem[];
  onOrderSuccess: (orderData: OrderCheckoutData) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  if (!isOpen || items.length === 0) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('정성껏 예쁘게 준비 부탁드립니다.');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('주문 진행을 위해 필수 약관에 동의해주세요.');
      return;
    }

    const orderData: OrderCheckoutData = {
      orderId: `JB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName,
      senderPhone,
      orderNotes,
      items,
      totalAmount,
      orderDate: new Date().toLocaleDateString('ko-KR'),
    };

    onOrderSuccess(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        id="checkout-modal-container"
        className="relative bg-[#FBF9F6] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E6DDD2] overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DDD2] bg-[#FBF9F6]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2C2723]/50 block font-light">
              Jerry Blossom Floral Checkout
            </span>
            <h2 className="text-base font-semibold text-[#2C2723]">
              꽃 주문서 작성
            </h2>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-2 text-[#2C2723]/60 hover:text-[#2C2723] hover:bg-[#EFE8DE] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs bg-[#FBF9F6]">
          {/* Section 1: 주문자 정보 */}
          <div>
            <h3 className="text-xs font-medium text-[#2C2723] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2C2723]" />
              1. 주문자 정보
            </h3>
            
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6DDD2] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#2C2723]/70 block mb-1 font-light">성함</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-white text-xs text-[#2C2723] px-3.5 py-2.5 rounded-lg border border-[#E2D8CC] focus:border-[#2C2723] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#2C2723]/70 block mb-1 font-light">연락처</label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-white text-xs text-[#2C2723] px-3.5 py-2.5 rounded-lg border border-[#E2D8CC] focus:border-[#2C2723] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#2C2723]/70 block mb-1 font-light">주문 요청사항 (선택)</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="플로리스트에게 전할 요청사항이 있다면 남겨주세요."
                  className="w-full bg-white text-xs text-[#2C2723] px-3.5 py-2.5 rounded-lg border border-[#E2D8CC] focus:border-[#2C2723] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 주문 상품 요약 */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E6DDD2]">
            <h4 className="text-xs font-medium text-[#2C2723] mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2C2723]" />
              2. 주문 상품 확인 ({items.length}개)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="text-[11px] bg-white p-3 rounded-lg border border-[#E6DDD2] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.flower.image}
                      alt={item.flower.name}
                      className="w-10 h-10 object-cover rounded-md border border-[#E6DDD2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#2C2723] truncate">{item.flower.name}</p>
                      <p className="text-[#2C2723]/60 font-light text-[10px]">수량: {item.quantity}개</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2C2723] whitespace-nowrap">
                    {item.totalPrice.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement Check */}
          <div className="pt-2 border-t border-[#E6DDD2] flex items-center gap-2">
            <input
              type="checkbox"
              id="agree-order-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 accent-[#2C2723] rounded-sm cursor-pointer"
            />
            <label htmlFor="agree-order-terms" className="text-[11px] text-[#2C2723]/70 cursor-pointer font-light">
              [필수] 생화 맞춤제작 특성상 주문 접수 후 단순 변심 취소가 불가함을 확인하였습니다.
            </label>
          </div>

          {/* Sticky Submit Footer inside form */}
          <div className="pt-4 border-t border-[#E6DDD2] flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#2C2723]/60 font-light">총 주문 금액</span>
              <span className="text-xl font-bold text-[#2C2723]">
                {totalAmount.toLocaleString()}원
              </span>
            </div>

            <button
              type="submit"
              id="submit-checkout-btn"
              className="inline-flex items-center gap-2 bg-[#2C2723] text-[#FBF9F6] hover:bg-[#1C1917] px-6 py-3 rounded-xl font-medium text-xs uppercase tracking-[0.2em] transition-all shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#EAE2D5]" />
              <span>주문 접수하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
