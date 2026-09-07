import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ItemRequest } from '../api/items';
import { FlowerItem } from '../types';

interface ProductFormModalProps {
  item: FlowerItem | null;
  isOpen: boolean;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (item: ItemRequest) => void;
}

const emptyItem: ItemRequest = {
  name: '',
  category: 'BOUQUET',
  flowerMeaning: '',
  occasionTag: '',
  price: 0,
  stock: 0,
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  item,
  isOpen,
  isSaving,
  error,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ItemRequest>(emptyItem);

  useEffect(() => {
    if (!isOpen) return;
    setForm(item ? {
      name: item.name,
      category: item.category as ItemRequest['category'],
      flowerMeaning: item.flowerMeaning,
      occasionTag: item.occasionTag,
      price: item.price,
      stock: item.stock,
    } : emptyItem);
  }, [isOpen, item]);

  if (!isOpen) return null;

  const updateField = <K extends keyof ItemRequest>(key: K, value: ItemRequest[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
      onClick={(event) => event.target === event.currentTarget && !isSaving && onClose()}
    >
      <form
        className="w-full max-w-lg rounded-2xl border border-[#E6DDD2] bg-[#FBF9F6] shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <div className="flex items-center justify-between border-b border-[#E6DDD2] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-[#2C2723]">{item ? '상품 수정' : '상품 등록'}</h2>
            <p className="mt-0.5 text-[11px] text-[#2C2723]/55">필수 정보를 입력한 뒤 저장해주세요.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-full p-2 text-[#2C2723]/60 hover:bg-[#EFE8DE] disabled:opacity-40" aria-label="닫기">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2 text-[11px] font-medium text-[#2C2723]">상품명
            <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]" />
          </label>
          <label className="text-[11px] font-medium text-[#2C2723]">카테고리
            <select value={form.category} onChange={(e) => updateField('category', e.target.value as ItemRequest['category'])} className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]">
              <option value="BOUQUET">핸드메이드 꽃다발</option>
              <option value="BASKET">꽃바구니</option>
              <option value="VASE_ARRANGEMENT">화병꽂이&amp;센터피스</option>
            </select>
          </label>
          <label className="text-[11px] font-medium text-[#2C2723]">상황 태그
            <input required value={form.occasionTag} onChange={(e) => updateField('occasionTag', e.target.value)} placeholder="예: 생일" className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]" />
          </label>
          <label className="sm:col-span-2 text-[11px] font-medium text-[#2C2723]">꽃말
            <input required value={form.flowerMeaning} onChange={(e) => updateField('flowerMeaning', e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]" />
          </label>
          <label className="text-[11px] font-medium text-[#2C2723]">가격 (원)
            <input required min="1" type="number" value={form.price || ''} onChange={(e) => updateField('price', Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]" />
          </label>
          <label className="text-[11px] font-medium text-[#2C2723]">재고
            <input required min="0" type="number" value={form.stock} onChange={(e) => updateField('stock', Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-[#E2D8CC] bg-white px-3 py-2 text-xs outline-none focus:border-[#2C2723]" />
          </label>
          {error && <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E6DDD2] bg-[#FAF8F5] px-5 py-4">
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-[#E2D8CC] px-4 py-2 text-xs text-[#2C2723]/70 disabled:opacity-40">취소</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#2C2723] px-4 py-2 text-xs font-medium text-[#FBF9F6] hover:bg-[#1C1917] disabled:opacity-50">{isSaving ? '저장 중…' : '저장'}</button>
        </div>
      </form>
    </div>
  );
};
