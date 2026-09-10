import type { FlowerItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export interface ItemPageResponse {
  content: FlowerItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ItemRequest {
  name: string;
  category: Exclude<FlowerItem['category'], 'all'>;
  flowerMeaning: string;
  occasionTag: string;
  itemDtl: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface ImageUploadResponse {
  imageUrl: string;
}

export function getItemImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl || imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  return new URL(imageUrl, API_URL).toString();
}

/**
 * 상품조회
 * @param keyword
 * @param category
 * @param occasionTag
 * @param page
 * @param size
 * @param signal
 */
export async function getItems(
  keyword?: string,
  category?: string,
  occasionTag?: string,
  page = 0,
  size = 8,
  signal?: AbortSignal,
): Promise<ItemPageResponse> {
  const url = new URL('/api/items', API_URL);

  if (keyword) {
    url.searchParams.set('keyword', keyword);
  }

  if (category) {
    url.searchParams.set('category', category);
  }

  if (occasionTag) {
    url.searchParams.set('occasionTag', occasionTag);
  }

  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error('상품 목록을 불러오지 못했습니다.');
  }

  return response.json();
}

export async function uploadItemImage(image: File, accessToken: string): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${API_URL}/api/uploads/items`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? '이미지를 업로드하지 못했습니다.');
  }

  return response.json();
}

async function requestItem(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  accessToken: string,
  item?: ItemRequest,
): Promise<FlowerItem | void> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(item ? { 'Content-Type': 'application/json' } : {}),
    },
    body: item ? JSON.stringify(item) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? '상품 요청을 처리하지 못했습니다.');
  }

  return response.status === 204 ? undefined : response.json();
}

/**
 * 상품등록
 * @param item
 * @param accessToken
 */
export async function createItem(item: ItemRequest, accessToken: string): Promise<FlowerItem> {
  return requestItem('/api/items', 'POST', accessToken, item) as Promise<FlowerItem>;
}

/**
 * 상품수정
 * @param id
 * @param item
 * @param accessToken
 */
export async function updateItem(id: number, item: ItemRequest, accessToken: string): Promise<FlowerItem> {
  return requestItem(`/api/items/${id}`, 'PUT', accessToken, item) as Promise<FlowerItem>;
}

/**
 * 상품삭제
 * @param id
 * @param accessToken
 */
export async function deleteItem(id: number, accessToken: string): Promise<void> {
  await requestItem(`/api/items/${id}`, 'DELETE', accessToken);
}
