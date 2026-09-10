export type FlowerCategory = 'all' | 'BOUQUET' | 'BASKET' | 'VASE_ARRANGEMENT';

export type FlowerSize = 'regular' | 'large' | 'premium';

export interface FlowerItem {
  id: number;
  name: string;
  category: string;
  price: number;
  flowerMeaning: string;
  occasionTag: string;
  itemDtl: string;
  stock: number;
  imageUrl?: string;
  image?: string;
}

export interface CustomOrderItem {
  id: string;
  flower: FlowerItem;
  size: FlowerSize;
  sizePriceDiff: number;
  packaging: 'kraft' | 'giftbox' | 'shoppingbag';
  packagingPrice: number;
  cardType: 'none' | 'printed' | 'calligraphy';
  cardPrice: number;
  cardMessage: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  quantity: number;
  totalPrice: number;
}

export interface OrderCheckoutData {
  orderId: string;
  senderName: string;
  senderPhone: string;
  recipientName?: string;
  recipientPhone?: string;
  orderNotes?: string;
  deliveryAddress?: string;
  detailAddress?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  deliveryNotes?: string;
  paymentMethod?: string;
  items: CustomOrderItem[];
  totalAmount: number;
  orderDate: string;
}
