/**
 * Entity cho đặt chỗ xe limousine
 */
export interface Booking {
  booking_id?: number;
  car_trip_id?: number;
  customer_name?: string;
  customer_phone?: string;
  departure_date?: string | Date;
  number_of_passengers?: number;
  total_price?: number;
  booking_status?: number; // 0: Pending, 1: Confirmed, 2: Cancelled
  notes?: string;
  pickup_location?: string;
  dropoff_location?: string;
  version?: number;
  deleted?: number;
  created_time?: string | Date;
  created_by?: number;
  updated_time?: string | Date;
  updated_by?: number;
}

/**
 * Enum cho trạng thái booking
 */
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2
}

/**
 * DTO cho việc tạo booking mới
 */
export interface CreateBookingDTO {
  car_trip_id: number;
  customer_name: string;
  customer_phone: string;
  departure_date: string | Date;
  number_of_passengers: number;
  pickup_location?: string;
  dropoff_location?: string;
  notes?: string;
}

/**
 * DTO cho việc cập nhật booking
 */
export interface UpdateBookingDTO {
  booking_id: number;
  customer_name?: string;
  customer_phone?: string;
  departure_date?: string | Date;
  number_of_passengers?: number;
  pickup_location?: string;
  dropoff_location?: string;
  notes?: string;
}
