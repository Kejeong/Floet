import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { OrderDetailModal } from './components/OrderDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MyPageModal } from './components/MyPageModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { login } from './api/auth';
import { getMyProfile, UserProfile } from './api/users';
import { getItems, ItemPageResponse } from './api/items';
import { addCartItem, CartResponse, getCart, removeCartItem, updateCartItemQuantity } from './api/cart';
import { FlowerCategory, FlowerItem, CustomOrderItem, OrderCheckoutData } from './types';
import { Check } from 'lucide-react';

const toCartItems = (cart: CartResponse, previousItems: CustomOrderItem[]): CustomOrderItem[] => (
  cart.items.map((cartItem) => {
    const previousItem = previousItems.find((item) => item.flower.id === cartItem.itemId);

    return {
      id: String(cartItem.itemId),
      flower: {
        id: cartItem.itemId,
        name: cartItem.name,
        category: previousItem?.flower.category ?? '',
        price: cartItem.unitPrice,
        flowerMeaning: previousItem?.flower.flowerMeaning ?? '',
        occasionTag: previousItem?.flower.occasionTag ?? '',
        itemDtl: previousItem?.flower.itemDtl ?? '',
        // 장바구니 API가 재고를 내려주지 않으므로, 수량 변경 시 서버의 재고 검증을 기준으로 한다.
        stock: previousItem?.flower.stock ?? Number.MAX_SAFE_INTEGER,
        imageUrl: cartItem.imageUrl ?? undefined,
      },
      size: 'regular',
      sizePriceDiff: 0,
      packaging: 'kraft',
      packagingPrice: 0,
      cardType: 'none',
      cardPrice: 0,
      cardMessage: '',
      deliveryDate: '',
      deliveryTimeSlot: '',
      quantity: cartItem.quantity,
      totalPrice: cartItem.totalPrice,
    };
  })
);

export default function App() {
  const [activeCategory, setActiveCategory] = useState<FlowerCategory>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Auth & My Page State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState<boolean>(false);

  const [flowers, setFlowers] = useState<FlowerItem[]>([]);
  const [pageInfo, setPageInfo] = useState<ItemPageResponse | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [cartItems, setCartItems] = useState<CustomOrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderCheckoutData[]>([]);

  // Modals
  const [selectedFlowerForOrder, setSelectedFlowerForOrder] = useState<FlowerItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderCheckoutData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const category = activeCategory === 'all' ? undefined : activeCategory;

    setIsLoading(true);
    setLoadError(null);

    getItems(
      searchQuery.trim() || undefined,
      category,
      selectedTag || undefined,
      page,
      8,
      controller.signal,
    )
      .then((itemPage) => {
        setFlowers(itemPage.content);
        setPageInfo(itemPage);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadError('상품 목록을 불러오지 못했습니다. 백엔드 서버를 확인해주세요.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [activeCategory, selectedTag, searchQuery, page, reloadKey]);

  // Show quick toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    if (!accessToken) return;

    let isActive = true;

    void getCart(accessToken)
      .then((cart) => {
        if (isActive) {
          setCartItems((previousItems) => toCartItems(cart, previousItems));
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          triggerToast(error instanceof Error ? error.message : '장바구니를 불러오지 못했습니다.');
        }
      });

    return () => {
      isActive = false;
    };
  }, [accessToken]);

  // Add to cart handler
  const handleAddToCart = async (item: CustomOrderItem) => {
    if (!accessToken) {
      handleLogin();
      triggerToast('장바구니는 로그인 후 이용할 수 있습니다.');
      return;
    }

    try {
      const cart = await addCartItem(item.flower.id, item.quantity, accessToken);
      setCartItems((previousItems) => toCartItems(cart, previousItems));
      triggerToast(`"${item.flower.name}" 상품이 장바구니에 담겼습니다.`);
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : '장바구니에 상품을 담지 못했습니다.');
    }
  };

  // Instant order handler (jump directly to checkout with this single item)
  const handleInstantOrder = (item: CustomOrderItem) => {
    setSelectedFlowerForOrder(null);
    // Add to cart if not present, and immediately open checkout
    setCartItems((prev) => [item, ...prev]);
    setIsCheckoutOpen(true);
  };

  // Cart item management
  const handleUpdateQuantity = async (id: string, delta: number) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    const newQuantity = Math.min(targetItem.flower.stock, Math.max(1, targetItem.quantity + delta));

    if (!accessToken) return;

    try {
      const cart = await updateCartItemQuantity(targetItem.flower.id, newQuantity, accessToken);
      setCartItems((previousItems) => toCartItems(cart, previousItems));
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : '장바구니 수량을 변경하지 못했습니다.');
    }
  };

  const handleRemoveCartItem = async (id: string) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    if (!accessToken) return;

    try {
      await removeCartItem(targetItem.flower.id, accessToken);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      triggerToast('장바구니에서 상품이 삭제되었습니다.');
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : '장바구니 상품을 삭제하지 못했습니다.');
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setProfile(null);
    setCartItems([]);
    triggerToast('성공적으로 로그아웃되었습니다.');
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  /**
   * 로그인 성공시
   */
  const handleLoginSuccess = async (email: string, password: string) => {
    const loginResponse = await login(email, password);
    const myProfile = await getMyProfile(loginResponse.accessToken);

    setAccessToken(loginResponse.accessToken);
    setProfile(myProfile);
    setIsLoginOpen(false);
    triggerToast('로그인되었습니다.');
  };

  /**
   * 주문 성공시
   */
  const handleOrderSuccess = (orderData: OrderCheckoutData) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(orderData);
    setOrderHistory((prev) => [orderData, ...prev]);
    setCartItems([]); // Empty cart upon successful order
  };

  const categoryTitle: Record<FlowerCategory, string> = {
    all: '전체 플라워 컬렉션',
    BOUQUET: '핸드메이드 꽃다발',
    BASKET: '꽃바구니',
    VASE_ARRANGEMENT: '화병 꽃꽂이',
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2C2723] selection:bg-[#E2D9CD] selection:text-[#2C2723]">
      {/* Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setPage(0);
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(keyword) => {
          setSearchQuery(keyword);
          setPage(0);
        }}
        isLoggedIn={accessToken !== null}
        userName={profile?.name}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onOpenMyPage={() => setIsMyPageOpen(true)}
      />

      {/* Hero Announcement & Tag Filter */}
      <HeroBanner
        selectedTag={selectedTag}
        onTagClick={(tag) => {
          setSelectedTag(tag);
          setPage(0);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full bg-white">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-8 pb-3.5 border-b border-[#E6DDD2]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2C2723]/50 block mb-1 font-light">
              Curated Botanical Collection
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-[#2C2723] tracking-tight">
              {selectedTag ? `#${selectedTag} 추천 컬렉션` : categoryTitle[activeCategory]}
            </h2>
          </div>

          <div className="text-xs text-[#2C2723]/60 font-light tracking-wider">
            총 <strong className="text-[#2C2723] font-medium">{pageInfo?.totalElements ?? 0}</strong>개의 작품
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E6DDD2] p-14 text-center text-sm text-[#2C2723]/70">
            상품을 불러오는 중입니다.
          </div>
        ) : loadError ? (
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E6DDD2] p-14 text-center text-[#2C2723]/70">
            <p className="text-sm font-medium text-[#2C2723] mb-4">{loadError}</p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="bg-[#2C2723] text-[#FBF9F6] text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 rounded-full hover:bg-[#1C1917] transition-all cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        ) : flowers.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-xl border border-[#E6DDD2] p-14 text-center text-[#2C2723]/70">
            <p className="text-sm font-medium text-[#2C2723] mb-2">
              조건에 부합하는 꽃 상품을 찾지 못했습니다
            </p>
            <p className="text-xs text-[#2C2723]/60 mb-6 font-light">
              검색어나 필터를 초기화하여 전체 플라워 컬렉션을 확인해보세요.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedTag('');
                setSearchQuery('');
                setPage(0);
              }}
              className="bg-[#2C2723] text-[#FBF9F6] text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 rounded-full hover:bg-[#1C1917] transition-all cursor-pointer"
            >
              전체 상품 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flowers.map((flower) => (
              <ProductCard
                key={flower.id}
                flower={flower}
                onSelect={(f) => setSelectedFlowerForOrder(f)}
              />
            ))}
          </div>
        )}

        {!isLoading && !loadError && pageInfo && pageInfo.totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="상품 목록 페이지 이동">
            <button
              type="button"
              disabled={pageInfo.first}
              onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
              className="rounded-lg border border-[#E2D8CC] bg-white px-4 py-2 text-xs text-[#2C2723] transition-colors hover:bg-[#EFE8DE] disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            <span className="text-xs text-[#2C2723]/70" aria-live="polite">
              {pageInfo.number + 1} / {pageInfo.totalPages}
            </span>
            <button
              type="button"
              disabled={pageInfo.last}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-lg border border-[#E2D8CC] bg-white px-4 py-2 text-xs text-[#2C2723] transition-colors hover:bg-[#EFE8DE] disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </nav>
        )}

        <div className="relative left-1/2 mt-14 h-px w-screen -translate-x-1/2 bg-[#E6DDD2]" aria-hidden="true" />

        {/* Why Jerry Blossom Section (Story / Assurance) */}
        <section className="mt-10 bg-[#FAF8F5] rounded-xl border border-[#E6DDD2] p-6 sm:p-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2C2723]/50 block font-light">
              Jerry Blossom Atelier Promise
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-[#2C2723] mt-1 mb-2.5">
              꽃을 선물하는 마음의 품격까지 고스란히 담아냅니다
            </h3>
            <p className="text-xs text-[#2C2723]/70 font-light leading-relaxed mb-5">
              제리 블라썸은 매일 새벽 화훼공판장에서 직접 경매된 최상급 A급 생화만을 엄선하여 플로리스트가 한 송이씩 정성껏 다듬습니다.
              오래도록 꽃의 아름다움을 즐기실 수 있도록 전용 생화 영양제를 동봉해 드리며, 정성을 다한 최상의 퀄리티를 약속드립니다.
            </p>
            <div className="flex flex-wrap gap-2.5 text-xs font-light text-[#2C2723]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E6DDD2] bg-[#F6F1EA]">
                <Check className="w-3.5 h-3.5 text-[#2C2723]" />
                새벽 경매 최상급 A급 생화
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E6DDD2] bg-[#F6F1EA]">
                <Check className="w-3.5 h-3.5 text-[#2C2723]" />
                전문 플로리스트 1:1 맞춤 제작
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E6DDD2] bg-[#F6F1EA]">
                <Check className="w-3.5 h-3.5 text-[#2C2723]" />
                생화 신선 보존 영양제 전 상품 동봉
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      {selectedFlowerForOrder && (
        <OrderDetailModal
          flower={selectedFlowerForOrder}
          onClose={() => setSelectedFlowerForOrder(null)}
          onAddToCart={handleAddToCart}
          onInstantOrder={handleInstantOrder}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        orderData={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLoginSuccess}
      />

      {/* My Page Modal */}
      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        orderHistory={orderHistory}
        profile={profile}
        accessToken={accessToken}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onItemsChanged={() => setReloadKey((key) => key + 1)}
      />

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C2723] text-[#FBF9F6] text-xs px-5 py-3 rounded-full shadow-lg flex items-center gap-2.5 border border-[#E6DDD2]/30 animate-fade-in tracking-wider">
          <Check className="w-3.5 h-3.5 text-[#EAE2D5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
