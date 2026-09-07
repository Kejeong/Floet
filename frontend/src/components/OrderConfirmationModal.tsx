import React from 'react';
import { CheckCircle2, Sparkles, ArrowRight, User } from 'lucide-react';
import { OrderCheckoutData } from '../types';

interface OrderConfirmationModalProps {
  orderData: OrderCheckoutData | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  orderData,
  onClose,
}) => {
  if (!orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        id="order-confirmation-modal"
        className="relative bg-[#FBF9F6] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E6DDD2] overflow-hidden my-6 flex flex-col animate-fade-in"
      >
        {/* Top Celebration Banner */}
        <div className="bg-[#2C2723] text-[#FBF9F6] p-7 text-center relative border-b border-[#3A332E]">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-3 text-[#EAE2D5]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#E6DDD2]/70 block font-light">
            Jerry Blossom Atelier Order Confirmed
          </span>
          <h2 className="text-lg font-semibold tracking-tight mt-1 text-[#FBF9F6]">
            소중한 꽃 주문이 정상 접수되었습니다
          </h2>
          <p className="text-xs text-[#E6DDD2]/80 mt-1.5 font-light">
            주문번호: <span className="font-mono font-medium text-white">{orderData.orderId}</span>
          </p>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6 space-y-4 text-xs bg-[#FBF9F6]">
          {/* Orderer & Items Summary */}
          <div className="space-y-2.5 border border-[#E6DDD2] rounded-xl p-4 bg-white">
            <h4 className="font-medium text-[#2C2723] text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-[#2C2723]" />
              주문자 및 주문 내역
            </h4>
            <div className="flex items-center justify-between text-[11px] font-light text-[#2C2723]/80 pb-2 border-b border-[#E6DDD2]/60">
              <div>
                <span className="text-[#2C2723]/50">주문자:</span>{' '}
                <strong className="text-[#2C2723] font-medium">{orderData.senderName} 님</strong> ({orderData.senderPhone})
              </div>
              <div>
                <span className="text-[#2C2723]/50">주문일:</span>{' '}
                <span className="text-[#2C2723] font-medium">{orderData.orderDate}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[11px]">
                  <span className="text-[#2C2723] font-medium">
                    {item.flower.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-[#2C2723]">
                    {item.totalPrice.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E6DDD2]/60 text-xs">
              <span className="font-medium text-[#2C2723]">총 주문금액</span>
              <strong className="text-sm font-bold text-[#2C2723]">
                {orderData.totalAmount.toLocaleString()}원
              </strong>
            </div>

            {orderData.orderNotes && (
              <div className="text-[11px] text-[#2C2723]/70 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6DDD2] font-light">
                요청사항: {orderData.orderNotes}
              </div>
            )}
          </div>

          {/* Flower Care Guide */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl text-[11px] text-[#2C2723] flex items-start gap-2.5 border border-[#E6DDD2]">
            <Sparkles className="w-3.5 h-3.5 text-[#2C2723] shrink-0 mt-0.5" />
            <div className="font-light leading-relaxed">
              <strong className="block mb-0.5 font-medium">꽃을 더 오래 싱싱하게 감상하는 팁</strong>
              <p className="text-[#2C2723]/70">
                제리 블라썸 전용 영양제를 차가운 물에 희석하고, 줄기 끝을 사선(45도)으로 1cm 잘라 신선한 물올림을 해주세요. 직사광선을 피해 서늘한 곳에 두시면 꽃의 아름다움을 더 오래 즐기실 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E6DDD2] flex justify-end">
          <button
            id="close-confirmation-btn"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C2723] text-[#FBF9F6] hover:bg-[#1C1917] px-6 py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
          >
            <span>확인 및 홈으로</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
