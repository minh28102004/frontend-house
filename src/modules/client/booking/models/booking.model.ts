export interface BookingRoomInfo {
  _id: string;
  concept: string;
  name: string;
  thumbnail?: string;
  gallery: string[];
  price: number;
  features: string[];
}

export interface CreateBookingPayload {
  concept: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestMessage?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  specialRequests?: string;
  numberOfGuests: number;
  cccdFront?: string;
  cccdBack?: string;
  paymentMethod?: "COD" | "VNPAY" | "VIETQR";
}

export interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestMessage: string;
  specialRequests: string;
  numberOfGuests: number;
  checkInDate: string;
  checkOutDate: string;
  cccdFront: string;
  cccdBack: string;
}

export interface PriceCalculation {
  roomPrice: number;
  nights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}
