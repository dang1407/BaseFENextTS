"use client";
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, Phone, Star, ArrowRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CarTripService } from '@/utils/cartripService';
import { CarTrip } from '@/entities/cartrip';

interface Trip {
  id: string;
  company: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  vehicleType: string;
  rating: number;
  reviews: number;
  amenities: string[];
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<CarTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        // Tìm kiếm tuyến đường từ API
        const response = await CarTripService.searchRoutes({
          departure: from,
          destination: to
        });

        if (response.success && response.data) {
          setRoutes(response.data);

          // Convert CarTrip data to Trip format for display
          // Note: This is mock data for time slots. In real app, you'd have a separate API for schedules
          const mockTrips: Trip[] = response.data.flatMap((route) => {
            // Generate multiple time slots for each route
            const timeSlots = ['06:00', '08:00', '10:00', '14:00', '16:00'];
            return timeSlots.map((time, idx) => {
              const durationHours = route.duration_hours || 2.5;
              const [hours, minutes] = time.split(':').map(Number);
              const arrivalHours = hours + Math.floor(durationHours);
              const arrivalMinutes = minutes + Math.round((durationHours % 1) * 60);
              const arrivalTime = `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`;

              return {
                id: `${route.car_trip_id}-${idx}`,
                company: 'Limousine Service', // In real app, this would come from route data
                from: route.departure || from,
                to: route.destination || to,
                departureTime: time,
                arrivalTime: arrivalTime,
                duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
                price: route.base_price || 150000,
                availableSeats: Math.floor(Math.random() * 10) + 3, // Mock data
                totalSeats: 16,
                vehicleType: 'Limousine 16 chỗ',
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 200) + 100,
                amenities: ['WiFi', 'Nước uống', 'Điều hòa', 'Ghế massage']
              };
            });
          });

          setTrips(mockTrips);
        } else {
          setError(response.message || 'Không thể tải danh sách tuyến đường');
          setTrips([]);
        }
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    if (from && to) {
      fetchRoutes();
    } else {
      setLoading(false);
    }
  }, [from, to]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

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

      {/* Search Summary */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/booking" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại tìm kiếm</span>
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{from}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-gray-900">{to}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{passengers} hành khách</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tìm kiếm chuyến xe...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error}
              </h3>
              <p className="text-gray-600 mb-6">
                Vui lòng thử lại sau hoặc liên hệ hỗ trợ
              </p>
              <Link href="/booking">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Tìm kiếm lại
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tìm thấy {trips.length} chuyến xe
                </h2>
                <p className="text-gray-600 mt-1">Chọn chuyến xe phù hợp với bạn</p>
              </div>

              <div className="space-y-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-md transition-all"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Company Info */}
                      <div className="lg:col-span-3">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{trip.company}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900">{trip.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-sm text-gray-500">({trip.reviews} đánh giá)</span>
                        </div>
                        <div className="text-sm text-gray-600">{trip.vehicleType}</div>
                      </div>

                      {/* Time Info */}
                      <div className="lg:col-span-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{trip.departureTime}</div>
                            <div className="text-sm text-gray-600 mt-1">{trip.from}</div>
                          </div>
                          <div className="flex-1 px-4">
                            <div className="text-center text-sm text-gray-500 mb-1">{trip.duration}</div>
                            <div className="relative">
                              <div className="h-0.5 bg-gray-300"></div>
                              <ArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 bg-white" />
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{trip.arrivalTime}</div>
                            <div className="text-sm text-gray-600 mt-1">{trip.to}</div>
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="lg:col-span-3">
                        <div className="flex flex-wrap gap-2">
                          {trip.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="text-gray-600">Còn </span>
                          <span className="font-semibold text-orange-600">
                            {trip.availableSeats}/{trip.totalSeats} chỗ
                          </span>
                        </div>
                      </div>

                      {/* Price & Book */}
                      <div className="lg:col-span-2 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">
                            {formatPrice(trip.price)}
                          </div>
                          <div className="text-sm text-gray-500">/ khách</div>
                        </div>
                        <Button
                          onClick={() => router.push(`/booking/confirm?tripId=${trip.id}&passengers=${passengers}`)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                        >
                          Đặt vé
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {trips.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MapPin className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy chuyến xe phù hợp
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vui lòng thử tìm kiếm với điều kiện khác
                  </p>
                  <Link href="/booking">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Tìm kiếm lại
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
