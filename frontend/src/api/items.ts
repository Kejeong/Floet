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
  price: number;
  stock: number;
}

export async function getItems(
  category?: string,
  page = 0,
  size = 8,
  signal?: AbortSignal,
): Promise<ItemPageResponse> {
  const url = new URL('/api/items', API_URL);

  if (category) {
    url.searchParams.set('category', category);
  }

  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error('상품 목록을 불러오지 못했습니다.');
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

export async function createItem(item: ItemRequest, accessToken: string): Promise<FlowerItem> {
  return requestItem('/api/items', 'POST', accessToken, item) as Promise<FlowerItem>;
}

export async function updateItem(id: number, item: ItemRequest, accessToken: string): Promise<FlowerItem> {
  return requestItem(`/api/items/${id}`, 'PUT', accessToken, item) as Promise<FlowerItem>;
}

export async function deleteItem(id: number, accessToken: string): Promise<void> {
  await requestItem(`/api/items/${id}`, 'DELETE', accessToken);
}
