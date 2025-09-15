'use client';

import { useAuth } from '@/hooks/useAuth';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLogined, loading } = useAuth();

  if (loading) {
    return <p>Đang xác thực...</p>;
  }
  if (!isLogined) {
    return <></>; // hoặc spinner
  }

  return <>{children}</>;
}
