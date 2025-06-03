"use client";
import Header from "@/components/header";
import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthCheck();
  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
