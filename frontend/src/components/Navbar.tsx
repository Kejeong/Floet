import React from 'react';
import { ShoppingBag, Flower2, Search, User } from 'lucide-react';
import { FlowerCategory } from '../types';

interface NavbarProps {
  activeCategory: FlowerCategory;
  onSelectCategory: (cat: FlowerCategory) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  onLogin: () => void;
  onOpenMyPage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  isLoggedIn,
  userName,
  onLogout,
  onLogin,
  onOpenMyPage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-b border-[#E6DDD2] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Right Utility Row for LOGOUT / LOGIN */}
        <div className="flex justify-end items-center pt-2.5 pb-1 text-[11px] font-light text-[#2C2723]/60 border-b border-[#E6DDD2]/60">
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-[#2C2723]/70 font-light">
                  <strong className="font-medium text-[#2C2723]">{userName ?? '회원'}</strong> 님
                </span>
                <span className="text-[#2C2723]/25">|</span>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="hover:text-[#2C2723] uppercase tracking-widest font-medium transition-colors cursor-pointer"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onLogin}
                className="hover:text-[#2C2723] uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              onSelectCategory('all');
              onSearchChange('');
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-[#2C2723]/20 flex items-center justify-center text-[#2C2723] group-hover:bg-[#2C2723] group-hover:text-[#FDFBF7] transition-colors">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-logo block text-lg sm:text-xl font-light tracking-[0.18em] text-[#2C2723] uppercase">
                Jerry Blossom
              </span>
              <span className="block text-[10px] text-[#2C2723]/60 tracking-[0.2em] uppercase font-light">
                Floral Atelier
              </span>
            </div>
          </button>

          {/* Search Bar - Center */}
          <div className="hidden md:flex items-center relative w-72 lg:w-80">
            <input
              id="search-flower-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="꽃 이름, 꽃말, 선물 목적 검색..."
              className="w-full bg-[#EFE8DE] text-xs text-[#2C2723] placeholder-[#2C2723]/40 pl-9 pr-4 py-2 rounded-full border border-[#E0D6C8] focus:border-[#2C2723] focus:bg-white focus:outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#2C2723]/40 absolute left-3 pointer-events-none" />
          </div>

          {/* Right Action Icons: MYPAGE, CART */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MYPAGE Trigger - beside CART */}
            <button
              id="mypage-trigger-btn"
              onClick={onOpenMyPage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#2C2723]/20 bg-white/80 hover:bg-[#EFE8DE] text-[#2C2723] text-xs font-medium uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              aria-label="마이페이지 열기"
            >
              <User className="w-3.5 h-3.5 text-[#2C2723]" />
              <span>MYPAGE</span>
            </button>

            {/* Cart Trigger */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#2C2723] text-[#FDFBF7] hover:bg-[#1C1917] px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all shadow-xs cursor-pointer"
              aria-label="장바구니 열기"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-sans">CART</span>
              <div className="w-5 h-5 bg-[#FDFBF7] text-[#2C2723] rounded-full flex items-center justify-center text-[10px] font-mono font-semibold">
                {cartCount}
              </div>
            </button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <nav className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 py-2.5 overflow-x-auto no-scrollbar border-t border-[#E6DDD2] text-xs">
          <button
            id="cat-all-btn"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#2C2723] text-[#FDFBF7]'
                : 'text-[#2C2723]/70 hover:text-[#2C2723] hover:bg-[#2C2723]/5'
            }`}
          >
            전체
          </button>
          <button
            id="cat-bouquet-btn"
            onClick={() => onSelectCategory('BOUQUET')}
            className={`px-3.5 py-1.5 rounded-full font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'BOUQUET'
                ? 'bg-[#2C2723] text-[#FDFBF7]'
                : 'text-[#2C2723]/70 hover:text-[#2C2723] hover:bg-[#2C2723]/5'
            }`}
          >
            핸드메이드 꽃다발
          </button>
          <button
            id="cat-basket-btn"
            onClick={() => onSelectCategory('BASKET')}
            className={`px-3.5 py-1.5 rounded-full font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'BASKET'
                ? 'bg-[#2C2723] text-[#FDFBF7]'
                : 'text-[#2C2723]/70 hover:text-[#2C2723] hover:bg-[#2C2723]/5'
            }`}
          >
            꽃바구니
          </button>
          <button
            id="cat-vase-btn"
            onClick={() => onSelectCategory('VASE_ARRANGEMENT')}
            className={`px-3.5 py-1.5 rounded-full font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'VASE_ARRANGEMENT'
                ? 'bg-[#2C2723] text-[#FDFBF7]'
                : 'text-[#2C2723]/70 hover:text-[#2C2723] hover:bg-[#2C2723]/5'
            }`}
          >
            화병꽂이&amp;센터피스
          </button>
        </nav>
      </div>
    </header>
  );
};
