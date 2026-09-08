import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Flower2 } from 'lucide-react';
import heroBannerImg from '../assets/images/MainPage_Flower01.jpg';

interface HeroBannerProps {
  onTagClick: (tag: string) => void;
  selectedTag: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onTagClick, selectedTag }) => {
  const quickTags = [
    { label: '전체', value: '' },
    { label: '생일', value: 'BIRTHDAY' },
    { label: '기념일', value: 'ANNIVERSARY' },
    { label: '축하', value: 'CONGRATULATION' },
    { label: '선물', value: 'GIFT' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-12 bg-[#F7F3EC] border-b border-[#E6DDD2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Text & Filter Area */}
          <div className="lg:col-span-7 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#2C2723]/50 block font-light mb-2.5">
              Jerry Blossom Botanical Atelier
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-light text-[#2C2723] tracking-tight leading-snug sm:leading-[1.3] mb-3.5">
              마음을 전하는 계절의 꽃, <br />
              가장{' '}
              <span className="relative inline-block px-1.5 font-medium text-[#A6505C]">
                <span className="relative z-10">싱그러운 순간</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1.5 h-2.5 -rotate-1 rounded-full bg-[#E9B9B2]/70"
                />
              </span>
              을 선물합니다
            </h1>

            <p className="text-xs sm:text-[13px] text-[#2C2723]/70 font-light leading-relaxed mb-6 max-w-xl">
              축하와 감사, 그리고 일상 속 소중한 순간에 전문 플로리스트의 세심한 손길로 완성됩니다. 
              최상급 A급 생화만을 엄선하여 한 송이씩 정성을 다해 디자인합니다.
            </p>

            {/* Quick Tag Pills */}
            <div>
              <p className="text-[11px] text-[#2C2723]/60 mb-2 font-medium tracking-wide">
                상황별 테마 추천
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {quickTags.map(({ label, value }) => {
                  const isSelected = selectedTag === value;
                  return (
                    <button
                      key={value || 'all'}
                      id={`tag-filter-${value || 'all'}`}
                      onClick={() => onTagClick(value)}
                      className={`text-[11px] px-3.5 py-1.5 rounded-full transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#2C2723] text-[#FDFBF7] border-[#2C2723] shadow-xs font-medium'
                          : 'bg-white/80 text-[#2C2723]/75 border-[#E2D8CC] hover:border-[#2C2723] hover:text-[#2C2723] hover:bg-[#EFE8DE]'
                      }`}
                    >
                      #{label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6DDD2] shadow-sm bg-[#F0EAE1] aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
              <img
                src={heroBannerImg}
                alt="제리 블라썸 아틀리에 생화 디자인"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[#FDFBF7] text-xs">
                <span className="text-[10px] tracking-widest uppercase font-mono opacity-80 backdrop-blur-xs px-2 py-1">
                  Atelier Jerry
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Feature Strip */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="bg-white/90 p-4 rounded-xl border border-[#E6DDD2] shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#E2D8CC] bg-[#F6F1EA] flex items-center justify-center text-[#2C2723] shrink-0">
              <Flower2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium tracking-wide text-[#2C2723]">최상급 새벽 생화</p>
              <p className="text-[11px] text-[#2C2723]/60 font-light">매일 아침 엄선된 프리미엄 생화</p>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-xl border border-[#E6DDD2] shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#E2D8CC] bg-[#F6F1EA] flex items-center justify-center text-[#2C2723] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium tracking-wide text-[#2C2723]">전문 플로리스트</p>
              <p className="text-[11px] text-[#2C2723]/60 font-light">1:1 맞춤 감각적인 꽃 디자인</p>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-xl border border-[#E6DDD2] shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#E2D8CC] bg-[#F6F1EA] flex items-center justify-center text-[#2C2723] shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium tracking-wide text-[#2C2723]">생화 전용 영양제</p>
              <p className="text-[11px] text-[#2C2723]/60 font-light">오래도록 싱싱하게 감상 지원</p>
            </div>
          </div>

          <div className="bg-white/90 p-4 rounded-xl border border-[#E6DDD2] shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#E2D8CC] bg-[#F6F1EA] flex items-center justify-center text-[#2C2723] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium tracking-wide text-[#2C2723]">완성 사진 알림</p>
              <p className="text-[11px] text-[#2C2723]/60 font-light">제작 완료 후 실물 사진 전송</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
