"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Clock, Users, Phone, Mail, User, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookingService } from '@/utils/bookingService';
import { CreateBookingDTO } from '@/entities/booking';

interface BookingInfo {
  fullName: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  note: string;
}

interface Trip {
  id: string;
  company: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  vehicleType: string;
  date: string;
}

function ConfirmBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('tripId') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const [trip, setTrip] = useState<Trip | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    fullName: '',
    phone: '',
    email: '',
    pickupAddress: '',
    dropoffAddress: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock trip data - In real app, fetch from API based on tripId
    // Parse tripId to extract route ID (format: routeId-timeSlotIdx)
    const [routeId] = tripId.split('-');

    const mockTrip: Trip = {
      id: tripId,
      company: 'Limousine Service',
      from: 'Hà Nội',
      to: 'Hải Phòng',
      departureTime: '06:00',
      arrivalTime: '08:30',
      duration: '2h 30m',
      price: 150000,
      vehicleType: 'Limousine 16 chỗ',
      date: new Date().toISOString().split('T')[0]
    };
    setTrip(mockTrip);
  }, [tripId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!bookingInfo.fullName || !bookingInfo.phone || !bookingInfo.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!trip) {
      alert('Không tìm thấy thông tin chuyến đi');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Parse tripId to get car_trip_id (format: routeId-timeSlotIdx)
      const [routeIdStr] = tripId.split('-');
      const carTripId = parseInt(routeIdStr);

      // Prepare booking data
      const bookingData: CreateBookingDTO = {
        car_trip_id: carTripId,
        customer_name: bookingInfo.fullName,
        customer_phone: bookingInfo.phone,
        departure_date: new Date(trip.date + 'T' + trip.departureTime),
        number_of_passengers: passengers,
        pickup_location: bookingInfo.pickupAddress || trip.from,
        dropoff_location: bookingInfo.dropoffAddress || trip.to,
        notes: bookingInfo.note
      };

      // Call API to create booking
      const response = await BookingService.createBooking(bookingData);

      if (response.success && response.data) {
        setBookingCode(`MT${response.data.booking_id?.toString().padStart(8, '0')}`);
        setShowSuccess(true);
      } else {
        setError(response.message || 'Đặt vé thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = trip ? trip.price * passengers : 0;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Đặt vé thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi thông tin chi tiết về email <strong>{bookingInfo.email}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-gray-600 mb-2">Mã đặt vé</div>
            <div className="text-xl font-bold text-orange-600">{bookingCode}</div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Vui lòng có mặt tại điểm đón trước giờ khởi hành 15 phút
            </p>
            <p className="text-sm text-gray-600">
              Liên hệ hotline <strong className="text-orange-600">1900 xxxx</strong> nếu cần hỗ trợ
            </p>
          </div>
          <div className="mt-8 space-y-3">
            <Link href="/booking" className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Đặt vé mới
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/booking" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MyTrip</h1>
                <p className="text-xs text-gray-500">Đặt xe limousine</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <a href="tel:1900xxxx" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <Phone className="w-4 h-4" />
                <span className="font-medium">1900 xxxx</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận đặt vé</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hành khách</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Nhập họ và tên"
                        value={bookingInfo.fullName}
                        onChange={(e) => setBookingInfo({ ...bookingInfo, fullName: e.target.value })}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="tel"
                          placeholder="Nhập số điện thoại"
                          value={bookingInfo.phone}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          value={bookingInfo.email}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
                          className="pl-10 h-11"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ đón
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Nhập địa chỉ cụ thể để xe đến đón"
                        value={bookingInfo.pickupAddress}
                        onChange={(e) => setBookingInfo({ ...bookingInfo, pickupAddress: e.target.value })}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ trả
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-orange-500 w-5 h-5" />
                      <Input
                        placeholder="Nhập địa chỉ cụ thể nơi bạn muốn xuống xe"
                        value={bookingInfo.dropoffAddress}
                        onChange={(e) => setBookingInfo({ ...bookingInfo, dropoffAddress: e.target.value })}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      placeholder="Ghi chú thêm cho tài xế (nếu có)"
                      value={bookingInfo.note}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, note: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Bằng việc đặt vé, bạn đồng ý với điều khoản sử dụng của chúng tôi
                  </p>
                </div>
              </form>
            </div>

            {/* Trip Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết chuyến đi</h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Nhà xe</div>
                    <div className="font-semibold text-gray-900">{trip.company}</div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{trip.departureTime}</div>
                        <div className="text-sm text-gray-600">{trip.from}</div>
                      </div>
                      <div className="flex-1 px-3">
                        <div className="relative">
                          <div className="h-0.5 bg-gray-300"></div>
                          <ArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 bg-white" />
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">{trip.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{trip.arrivalTime}</div>
                        <div className="text-sm text-gray-600">{trip.to}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(trip.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span>{passengers} hành khách</span>
                    </div>
                    <div className="text-sm text-gray-600">{trip.vehicleType}</div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Giá vé ({passengers} x {formatPrice(trip.price)})</span>
                      <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-900">Tổng cộng</span>
                      <span className="text-orange-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <ConfirmBookingContent />
    </Suspense>
  );
}
