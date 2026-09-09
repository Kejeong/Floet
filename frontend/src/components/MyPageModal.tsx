import React, { useEffect, useState } from 'react';
import { X, User, Package, CheckCircle2, Plus, Pencil, Trash2 } from 'lucide-react';
import { OrderCheckoutData } from '../types';
import { UserProfile } from '../api/users';
import { createItem, deleteItem, getItemImageUrl, getItems, ItemRequest, updateItem, uploadItemImage } from '../api/items';
import { FlowerItem } from '../types';
import { ProductFormModal } from './ProductFormModal';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderHistory: OrderCheckoutData[];
  profile: UserProfile | null;
  accessToken: string | null;
  onLogout: () => void;
  onItemsChanged: () => void;
}

export const MyPageModal: React.FC<MyPageModalProps> = ({
  isOpen,
  onClose,
  orderHistory,
  profile,
  accessToken,
  onLogout,
  onItemsChanged,
}) => {
  const isAdmin = profile?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [products, setProducts] = useState<FlowerItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FlowerItem | null | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = async () => {
    setIsProductsLoading(true);
    setProductsError(null);
    try {
      const page = await getItems(undefined, 0, 100);
      setProducts(page.content);
    } catch {
      setProductsError('상품 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin && activeTab === 'products') {
      void loadProducts();
    }
  }, [isOpen, isAdmin, activeTab]);

  useEffect(() => {
    setActiveTab(isAdmin ? 'products' : 'orders');
  }, [isAdmin]);

  const handleSaveProduct = async (item: ItemRequest, image: File | null) => {
    if (!accessToken) return;
    setIsSaving(true);
    setFormError(null);
    try {
      const itemWithImage = { ...item };
      if (image) {
        const uploadedImage = await uploadItemImage(image, accessToken);
        itemWithImage.imageUrl = uploadedImage.imageUrl;
      }

      if (editingItem) {
        await updateItem(editingItem.id, itemWithImage, accessToken);
      } else {
        await createItem(itemWithImage, accessToken);
      }
      setEditingItem(undefined);
      await loadProducts();
      onItemsChanged();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '상품을 저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (item: FlowerItem) => {
    if (!accessToken || !window.confirm(`“${item.name}” 상품을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    setDeletingId(item.id);
    setProductsError(null);
    try {
      await deleteItem(item.id, accessToken);
      await loadProducts();
      onItemsChanged();
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : '상품을 삭제하지 못했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="mypage-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="mypage-modal-container"
        className="relative bg-[#FBF9F6] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E6DDD2] overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DDD2] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EFE8DE] border border-[#E2D8CC] flex items-center justify-center text-[#2C2723]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#2C2723]">
                마이페이지 (MY PAGE)
              </h2>
            </div>
          </div>
          <button
            id="close-mypage-btn"
            onClick={onClose}
            className="p-2 text-[#2C2723]/60 hover:text-[#2C2723] hover:bg-[#EFE8DE] rounded-full transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs bg-[#FBF9F6]">
          {/* Member Profile Overview Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E6DDD2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#F5EFEB] border border-[#DFD5C7] flex items-center justify-center text-[#2C2723] text-lg font-semibold">
                {profile?.name.charAt(0) ?? '?'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2C2723]">{profile?.name ?? '로그인이 필요합니다.'}</h3>
                <p className="text-[#2C2723]/60 text-[11px] mt-0.5 font-light">
                  {profile
                    ? `${profile.phoneNumber ?? '전화번호 미등록'} · ${profile.email}`
                    : '로그인 후 회원 정보를 불러옵니다.'}
                </p>
              </div>
            </div>

            <button
              id="mypage-inner-logout-btn"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-[11px] text-[#2C2723]/60 hover:text-[#2C2723] border border-[#E2D8CC] hover:border-[#2C2723]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          </div>

          {!isAdmin && (
            <div className="border-b border-[#E6DDD2] pb-2">
              <span className="inline-flex rounded-full bg-[#2C2723] px-3 py-1.5 text-[11px] font-medium text-[#FBF9F6]">
                주문 내역
              </span>
            </div>
          )}

          {activeTab === 'orders' ? (
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DDD2] mb-3">
              <h3 className="font-semibold text-xs text-[#2C2723]">
                주문 내역 ({orderHistory.length}건)
              </h3>
            </div>

            <div className="space-y-3">
              {orderHistory.length === 0 ? (
                <div className="py-12 text-center text-[#2C2723]/60 bg-white rounded-xl border border-[#E6DDD2] p-6">
                  <Package className="w-8 h-8 mx-auto text-[#2C2723]/30 mb-2" />
                  <p className="font-medium text-[#2C2723] text-xs">최근 주문 내역이 없습니다</p>
                  <p className="text-[11px] text-[#2C2723]/50 mt-1 font-light">
                    계절의 가장 아름다운 꽃을 제리 블라썸에서 만나보세요.
                  </p>
                </div>
              ) : (
                orderHistory.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-xl p-4 border border-[#E6DDD2] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#E6DDD2]/60 pb-2.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#2C2723]/70 font-medium">
                          {order.orderId}
                        </span>
                        <span className="text-[#2C2723]/30">|</span>
                        <span className="text-[#2C2723]/60 font-light">{order.orderDate}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EAE2D5] text-[#2C2723]">
                        <CheckCircle2 className="w-3 h-3 text-[#2C2723]" />
                        주문 접수 완료
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <img
                            src={getItemImageUrl(item.flower.imageUrl ?? item.flower.image)}
                            alt={item.flower.name}
                            className="w-12 h-12 object-cover rounded-lg border border-[#E6DDD2]"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-xs text-[#2C2723]">{item.flower.name}</p>
                            <p className="text-[11px] text-[#2C2723]/60 font-light">
                              수량: {item.quantity}개
                            </p>
                          </div>
                          <span className="font-semibold text-xs text-[#2C2723]">
                            {item.totalPrice.toLocaleString()}원
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E6DDD2]/60 flex items-center justify-between text-[11px]">
                      <div className="text-[#2C2723]/70 font-light">
                        주문자: <strong className="font-medium text-[#2C2723]">{order.senderName}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[#2C2723]/60 text-[10px] mr-1">주문금액</span>
                        <strong className="text-xs font-bold text-[#2C2723]">
                          {order.totalAmount.toLocaleString()}원
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          ) : (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#2C2723]">상품 관리</h3>
                <p className="mt-0.5 text-[11px] font-light text-[#2C2723]/55">상품을 등록하고 재고 및 정보를 관리합니다.</p>
              </div>
              <button
                onClick={() => { setFormError(null); setEditingItem(null); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2C2723] px-3 py-2 text-[11px] font-medium text-[#FBF9F6] hover:bg-[#1C1917]"
              >
                <Plus className="h-3.5 w-3.5" /> 상품 등록
              </button>
            </div>

            {isProductsLoading ? (
              <div className="rounded-xl border border-[#E6DDD2] bg-white p-10 text-center text-[11px] text-[#2C2723]/60">상품을 불러오는 중입니다.</div>
            ) : productsError ? (
              <div className="rounded-xl border border-[#E6DDD2] bg-white p-8 text-center">
                <p className="text-[11px] text-red-700">{productsError}</p>
                <button onClick={() => void loadProducts()} className="mt-3 text-[11px] font-medium underline">다시 시도</button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#E6DDD2] bg-white">
                {products.length === 0 ? (
                  <p className="p-10 text-center text-[11px] text-[#2C2723]/60">등록된 상품이 없습니다.</p>
                ) : products.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-[#E6DDD2]/70 p-3.5 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="truncate text-xs font-semibold text-[#2C2723]">{item.name}</p>
                        <span className="text-[10px] text-[#2C2723]/45">{item.category}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#2C2723]/60">{item.price.toLocaleString()}원 · 재고 {item.stock}개 · #{item.occasionTag}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button onClick={() => { setFormError(null); setEditingItem(item); }} className="rounded-lg border border-[#E2D8CC] p-2 text-[#2C2723]/70 hover:bg-[#EFE8DE]" aria-label={`${item.name} 수정`}><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => void handleDeleteProduct(item)} disabled={deletingId === item.id} className="rounded-lg border border-[#E2D8CC] p-2 text-red-700/75 hover:bg-red-50 disabled:opacity-40" aria-label={`${item.name} 삭제`}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E6DDD2] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#2C2723]/50 font-light">
            제리 블라썸과 함께 향기로운 하루 되세요.
          </span>
          <button
            onClick={onClose}
            className="bg-[#2C2723] text-[#FBF9F6] hover:bg-[#1C1917] px-5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
      <ProductFormModal
        isOpen={editingItem !== undefined}
        item={editingItem ?? null}
        isSaving={isSaving}
        error={formError}
        onClose={() => !isSaving && setEditingItem(undefined)}
        onSubmit={(item, image) => void handleSaveProduct(item, image)}
      />
    </div>
  );
};
