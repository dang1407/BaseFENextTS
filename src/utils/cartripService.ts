import { ApiService } from './api-service';
import ApiUrl from '@/constants/ApiUrl';
import { CarTrip, CreateCarTripDTO, UpdateCarTripDTO, SearchRouteParams } from '@/entities/cartrip';

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
 * Service để quản lý các API calls liên quan đến CarTrip (Route)
 */
export class CarTripService {
  /**
   * Lấy danh sách tất cả các tuyến đường
   */
  static async getAllRoutes(): Promise<ApiResponse<CarTrip[]>> {
    try {
      const response = await ApiService.get<ApiResponse<CarTrip[]>>(ApiUrl.CarTrip);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Lấy danh sách các tuyến đường đang hoạt động
   */
  static async getActiveRoutes(): Promise<ApiResponse<CarTrip[]>> {
    try {
      const response = await ApiService.get<ApiResponse<CarTrip[]>>(`${ApiUrl.CarTrip}/active`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Tìm kiếm tuyến đường theo điểm đi và điểm đến
   */
  static async searchRoutes(params: SearchRouteParams): Promise<ApiResponse<CarTrip[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.departure) queryParams.append('departure', params.departure);
      if (params.destination) queryParams.append('destination', params.destination);

      const response = await ApiService.get<any>(`${ApiUrl.CarTrip}/search?${queryParams}`);
      return response;
    } catch (error: any) {
      console.log(error)
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tìm kiếm tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Lấy thông tin chi tiết một tuyến đường
   */
  static async getRouteById(id: number): Promise<ApiResponse<CarTrip>> {
    try {
      const response = await ApiService.get<ApiResponse<CarTrip>>(`${ApiUrl.CarTrip}/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Tạo tuyến đường mới
   */
  static async createRoute(route: CreateCarTripDTO): Promise<ApiResponse<CarTrip>> {
    try {
      const response = await ApiService.post<ApiResponse<CarTrip>>(
        ApiUrl.CarTrip,
        'CreateRoute',
        route
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Cập nhật thông tin tuyến đường
   */
  static async updateRoute(
    id: number,
    route: UpdateCarTripDTO
  ): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.CarTrip}/${id}`,
        'UpdateRoute',
        route
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật tuyến đường',
        error: error.message
      };
    }
  }

  /**
   * Xóa tuyến đường
   */
  static async deleteRoute(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await ApiService.post<ApiResponse<void>>(
        `${ApiUrl.CarTrip}/${id}`,
        'DeleteRoute',
        {}
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa tuyến đường',
        error: error.message
      };
    }
  }
}
