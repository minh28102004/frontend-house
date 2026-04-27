'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getMyCurrentStayBooking } from '@/modules/client/booking/services/booking.service';
import type { RoomBooking } from '@/modules/admin/rooms/types/booking.types';
import ServicesModal from '../components/ServicesModal';

function formatStayRange(
  checkIn: string,
  checkOut: string,
  locale: 'vi' | 'en',
): string {
  const opt: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const loc = locale === 'vi' ? 'vi-VN' : 'en-US';
  const a = new Date(checkIn).toLocaleDateString(loc, opt);
  const b = new Date(checkOut).toLocaleDateString(loc, opt);
  return `${a} — ${b}`;
}

export default function MyRoomPage() {
  const { isAuthenticated, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [booking, setBooking] = useState<RoomBooking | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const t =
    language === 'vi'
      ? {
          title: 'Phòng của bạn',
          loading: 'Đang tải…',
          empty: 'Hiện bạn không có phòng.',
          emptyHint:
            'Hiển thị khi bạn đã đặt phòng (đã xác nhận, đang trong kỳ lưu trú) và đã đăng nhập lúc đặt (hoặc email đặt trùng email tài khoản). Booking cũ có thể chưa gắn tài khoản — vui lòng đặt lại nếu cần.',
          backRooms: 'Xem danh sách phòng',
          roomLabel: 'Phòng',
          stay: 'Thời gian lưu trú',
          viewRoom: 'Xem chi tiết phòng',
          services: 'Dịch vụ',
        }
      : {
          title: 'Your room',
          loading: 'Loading…',
          empty: 'You do not have an active room stay.',
          emptyHint:
            'Shows when you have a confirmed stay for today and you were signed in when booking (or the guest email matches your account).',
          backRooms: 'Browse rooms',
          roomLabel: 'Room',
          stay: 'Stay dates',
          viewRoom: 'View room details',
          services: 'Services',
        };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setError(null);
        const tok =
          token ??
          (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        const data = await getMyCurrentStayBooking(tok);
        if (!cancelled) {
          setBooking(data ?? null);
        }
      } catch {
        if (!cancelled) {
          setError(
            language === 'vi'
              ? 'Không tải được thông tin phòng. Thử lại sau.'
              : 'Could not load room info. Try again later.',
          );
          setBooking(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, router, language]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-24 px-4 text-center text-sm text-stone-500">
        {t.loading}
      </div>
    );
  }

  return (
    <>
    <div className="max-w-lg mx-auto py-10 md:py-16 px-4 md:px-0 mt-12 md:mt-20">
      <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight mb-8">
        {t.title}
      </h1>

      {booking === undefined && (
        <p className="text-sm text-stone-500">{t.loading}</p>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {booking === null && !error && (
        <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-6 md:p-8">
          <p className="text-stone-800 font-medium mb-2">{t.empty}</p>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            {t.emptyHint}
          </p>
          <Link
            href="/rooms"
            className="inline-flex text-sm font-medium text-[#5C6645] underline-offset-4 hover:underline"
          >
            {t.backRooms}
          </Link>

          {/* Nút Dịch vụ — hiện cả khi chưa có phòng */}
          <button
            onClick={() => setServicesOpen(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-full border border-stone-300 text-stone-700 text-sm font-medium px-5 py-2.5 hover:bg-stone-100 hover:border-stone-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            {t.services}
          </button>
        </div>
      )}

      {booking && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">
            {t.roomLabel}
          </p>
          <p className="text-xl font-semibold text-stone-900 mb-1">
            {booking.roomName}
          </p>
          <p className="text-sm text-stone-600 mb-6">{t.stay}:{' '}
            {formatStayRange(
              booking.checkInDate,
              booking.checkOutDate,
              language === 'vi' ? 'vi' : 'en',
            )}
          </p>
          <Link
            href={`/rooms/${booking.concept}`}
            className="inline-flex items-center justify-center rounded-full bg-stone-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-stone-800 transition-colors"
          >
            {t.viewRoom}
          </Link>

          {/* Nút Dịch vụ */}
          <button
            onClick={() => setServicesOpen(true)}
            className="w-full mt-3 flex items-center justify-center gap-2 rounded-full border border-stone-300 text-stone-700 text-sm font-medium px-5 py-2.5 hover:bg-stone-100 hover:border-stone-400 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            {t.services}
          </button>
        </div>
      )}
    </div>

    <ServicesModal
      isOpen={servicesOpen}
      onClose={() => setServicesOpen(false)}
      bookingId={booking?._id ?? null}
      roomName={booking?.roomName ?? null}
    />
    </>
  );
}
