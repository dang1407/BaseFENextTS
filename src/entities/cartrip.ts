/**
 * Entity cho tuyến đường xe limousine (CarTrip/Route)
 */
export interface CarTrip {
  car_trip_id?: number;
  departure?: string;
  destination?: string;
  distance_km?: number;
  duration_hours?: number;
  base_price?: number;
  status?: number; // 0: Inactive, 1: Active
  description?: string;
  version?: number;
  deleted?: number;
  created_time?: string | Date;
  created_by?: number;
  updated_time?: string | Date;
  updated_by?: number;
}

/**
 * Enum cho trạng thái tuyến đường
 */
export enum RouteStatus {
  Inactive = 0,
  Active = 1
}

/**
 * DTO cho việc tạo tuyến đường mới
 */
export interface CreateCarTripDTO {
  departure: string;
  destination: string;
  distance_km?: number;
  duration_hours?: number;
  base_price: number;
  status?: number;
  description?: string;
}

/**
 * DTO cho việc cập nhật tuyến đường
 */
export interface UpdateCarTripDTO {
  car_trip_id: number;
  departure?: string;
  destination?: string;
  distance_km?: number;
  duration_hours?: number;
  base_price?: number;
  status?: number;
  description?: string;
}

/**
 * DTO cho tìm kiếm tuyến đường
 */
export interface SearchRouteParams {
  departure?: string;
  destination?: string;
}
