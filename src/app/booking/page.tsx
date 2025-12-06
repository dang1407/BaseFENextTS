"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Clock, Search, Phone, Mail, User, PhoneCall } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@/components/custom/DatePicker';

interface BookingForm {
  from: string;
  to: string;
  date: string;
  passengers: number;
  mobile: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [form, setForm] = useState<BookingForm>({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    mobile: ''
  });

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Hải Phòng', price: '150.000đ', duration: '2h' },
    { from: 'Hà Nội', to: 'Quảng Ninh', price: '200.000đ', duration: '3h' },
    { from: 'Hà Nội', to: 'Ninh Bình', price: '120.000đ', duration: '2h' },
    { from: 'Hà Nội', to: 'Hạ Long', price: '180.000đ', duration: '2.5h' },
    { from: 'Hà Nội', to: 'Sapa', price: '350.000đ', duration: '6h' },
    { from: 'Hà Nội', to: 'Hà Giang', price: '400.000đ', duration: '7h' },
  ];

  const handleSearch = () => {
    if (form.from && form.to && form.date) {
      // Navigate to search results with query params
      const params = new URLSearchParams({
        from: form.from,
        to: form.to,
        date: form.date,
        passengers: form.passengers.toString()
      });
      router.push(`/booking/search?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MyTrip</h1>
                <p className="text-xs text-gray-500">Đặt xe limousine</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:1900xxxx" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <Phone className="w-4 h-4" />
                <span className="font-medium">1900 xxxx</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search Form */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Đặt vé xe limousine ghép chỗ
            </h2>
            <p className="text-gray-600">
              Tìm và đặt vé xe limousine nhanh chóng, tiện lợi, giá tốt nhất
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-7xl mx-auto bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đi
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Nhập điểm đi..."
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đến
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    placeholder="Nhập điểm đến..."
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đi
                </label>
                <div className="relative">
                  {/* <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="pl-10 h-12 border-gray-300"
                  /> */}
                  <DateTimePicker
                    onChange={(e) => setForm({ ...form, date: e?.toDateString() ?? '' })}
                    mode='datetime'
                  />
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số hành khách
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="number"
                    min="1"
                    max="16"
                    value={form.passengers}
                    onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) || 1 })}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium text-base"
            >
              <Search className="w-5 h-5 mr-2" />
              Tìm chuyến xe
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Tuyến đường phổ biến</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setForm({ ...form, from: route.from, to: route.to });
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{route.from}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900">{route.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-bold text-lg">{route.price}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {route.duration}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Xe limousine ghép chỗ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Tại sao chọn MyTrip?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dễ dàng tìm kiếm</h4>
              <p className="text-sm text-gray-600">
                Tìm kiếm và so sánh hàng trăm tuyến xe limousine
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Đặt vé nhanh chóng</h4>
              <p className="text-sm text-gray-600">
                Đặt vé chỉ trong vài phút, không cần đăng nhập
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h4>
              <p className="text-sm text-gray-600">
                Đội ngũ hỗ trợ nhiệt tình, sẵn sàng giúp đỡ mọi lúc
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Giá tốt nhất</h4>
              <p className="text-sm text-gray-600">
                Cam kết giá vé cạnh tranh, nhiều ưu đãi hấp dẫn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Về MyTrip</h4>
              <p className="text-sm">
                Nền tảng đặt vé xe limousine hàng đầu Việt Nam, kết nối hành khách với các nhà xe uy tín.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Hotline: 1900 xxxx</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Email: support@MyTrip.vn</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tuyến phổ biến</h4>
              <ul className="space-y-2 text-sm">
                <li>Xe Hà Nội - Hải Phòng</li>
                <li>Xe Hà Nội - Quảng Ninh</li>
                <li>Xe Hà Nội - Sapa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            <p>&copy; 2024 MyTrip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
