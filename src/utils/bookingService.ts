import { ApiService } from './api-service';
import ApiUrl from '@/constants/ApiUrl';
import { Booking, CreateBookingDTO, UpdateBookingDTO } from '@/entities/booking';

/**
 * Response wrapper từ backend
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Service để quản lý các API calls liên quan đến Booking
 */
export class BookingService {
  /**
   * Lấy danh sách tất cả các đặt chỗ
   */
  static async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await ApiService.get<ApiResponse<Booking[]>>(ApiUrl.Booking);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Lấy thông tin chi tiết một đặt chỗ
   */
  static async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    try {
      const response = await ApiService.get<ApiResponse<Booking>>(`${ApiUrl.Booking}/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Lấy danh sách đặt chỗ theo tuyến đường
   */
  static async getBookingsByRoute(routeId: number): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await ApiService.get<ApiResponse<Booking[]>>(`${ApiUrl.Booking}/route/${routeId}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Lấy danh sách đặt chỗ theo số điện thoại
   */
  static async getBookingsByPhone(phone: string): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await ApiService.get<ApiResponse<Booking[]>>(`${ApiUrl.Booking}/phone/${phone}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Lấy danh sách đặt chỗ theo khoảng thời gian
   */
  static async getBookingsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<Booking[]>> {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      const response = await ApiService.get<ApiResponse<Booking[]>>(`${ApiUrl.Booking}/date-range?${params}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Tạo đặt chỗ mới
   */
  static async createBooking(booking: CreateBookingDTO): Promise<ApiResponse<Booking>> {
    try {
      const response = await ApiService.post<ApiResponse<Booking>>(
        ApiUrl.Booking,
        'CreateBooking',
        booking
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Cập nhật thông tin đặt chỗ
   */
  static async updateBooking(
    id: number,
    booking: UpdateBookingDTO
  ): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.Booking}/${id}`,
        'UpdateBooking',
        booking
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Xác nhận đặt chỗ
   */
  static async confirmBooking(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.Booking}/${id}/confirm`,
        'ConfirmBooking',
        {}
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xác nhận đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Hủy đặt chỗ
   */
  static async cancelBooking(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.Booking}/${id}/cancel`,
        'CancelBooking',
        {}
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi hủy đặt chỗ',
        error: error.message
      };
    }
  }

  /**
   * Xóa đặt chỗ
   */
  static async deleteBooking(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.Booking}/${id}`,
        'DeleteBooking',
        {}
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa đặt chỗ',
        error: error.message
      };
    }
  }
}
