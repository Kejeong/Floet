import React from 'react';
import { Flower2, Clock, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2C2723] text-[#FBF9F6] pt-14 pb-12 mt-20 border-t border-[#3A332E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-10 border-b border-[#E6DDD2]/15 text-xs">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#FBF9F6]">
                <Flower2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-logo text-lg font-light tracking-[0.2em] text-[#FBF9F6] uppercase">
                Jerry Blossom
              </span>
            </div>
            <p className="text-[#E6DDD2]/70 text-xs font-light leading-relaxed">
              자연의 우아함과 계절의 서사를 담아 가장 신선한 꽃으로 소중한 마음을 전하는 온라인 플라워 아틀리에입니다.
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-[#E6DDD2]/60 hover:text-white cursor-pointer transition-colors tracking-widest uppercase">
                Instagram @jerryblossom.atelier
              </span>
            </div>
          </div>

          {/* Guide Column (no delivery mention) */}
          <div>
            <h4 className="text-[#FBF9F6] font-medium text-xs tracking-[0.2em] mb-4 uppercase">
              이용 및 서비스 안내
            </h4>
            <ul className="space-y-2.5 text-[#E6DDD2]/70 font-light leading-relaxed">
              <li>매일 새벽 화훼공판장 최상급 A급 생화</li>
              <li>전문 플로리스트 1:1 맞춤 꽃 디자인</li>
              <li>생화 전용 신선 보존 영양제 기본 제공</li>
              <li>주문 제작 완료 후 실물 사진 알림 서비스</li>
            </ul>
          </div>

          {/* Studio Hours */}
          <div>
            <h4 className="text-[#FBF9F6] font-medium text-xs tracking-[0.2em] mb-4 uppercase">
              아틀리에 운영 시간
            </h4>
            <div className="space-y-2.5 text-[#E6DDD2]/70 font-light">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#E6DDD2]" />
                평일 09:00 - 18:00 (주말 예약제)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E6DDD2]" />
                contact@jerryblossom.kr
              </p>
            </div>
          </div>

          {/* Studio Info */}
          <div>
            <h4 className="text-[#FBF9F6] font-medium text-xs tracking-[0.2em] mb-4 uppercase">
              제리 블라썸 아틀리에
            </h4>
            <div className="space-y-2.5 text-[#E6DDD2]/70 font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E6DDD2] shrink-0 mt-0.5" />
                <span>서울특별시 서초구 반포대로 제리 블라썸 플라워 부티크</span>
              </p>
              <p className="text-[11px] text-[#E6DDD2]/50 pt-2 leading-relaxed">
                * 방문 수령 및 커스텀 오더 상담을 원하실 경우 사전 예약 후 방문해주시면 보다 섬세하게 안내해 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#E6DDD2]/50 font-light">
          <p>© 2026 Jerry Blossom Atelier. All Rights Reserved. 온라인 플라워 부티크.</p>
          <div className="flex gap-6 tracking-wider uppercase">
            <span className="hover:text-white cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-white cursor-pointer transition-colors">개인정보처리방침</span>
            <span className="hover:text-white cursor-pointer transition-colors">플로리스트 제휴</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
