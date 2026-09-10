const API_URL = import.meta.env.VITE_API_URL;

export interface CartItemResponse {
  itemId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string | null;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalAmount: number;
}

async function requestCart(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  accessToken: string,
  body?: object,
): Promise<CartResponse | void> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? '장바구니 요청을 처리하지 못했습니다.');
  }

  return response.status === 204 ? undefined : response.json();
}

export function getCart(accessToken: string): Promise<CartResponse> {
  return requestCart('/api/cart', 'GET', accessToken) as Promise<CartResponse>;
}

export function addCartItem(itemId: number, quantity: number, accessToken: string): Promise<CartResponse> {
  return requestCart('/api/cart/items', 'POST', accessToken, { itemId, quantity }) as Promise<CartResponse>;
}

export function updateCartItemQuantity(itemId: number, quantity: number, accessToken: string): Promise<CartResponse> {
  return requestCart(`/api/cart/items/${itemId}`, 'PATCH', accessToken, { quantity }) as Promise<CartResponse>;
}

export function removeCartItem(itemId: number, accessToken: string): Promise<void> {
  return requestCart(`/api/cart/items/${itemId}`, 'DELETE', accessToken) as Promise<void>;
}
