// middleware.ts (đặt ở thư mục gốc của dự án)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from 'cookies-next';

// Danh sách các đường dẫn cần bảo vệ
const protectedPaths = [
    '/yourbooking',
    '/profile',
    '/home',
    // Thêm các trang khác cần bảo vệ
];

export function middleware(request: NextRequest) {
    console.log(`Middleware triggered for: ${request.nextUrl.pathname}`);

    // Lấy token từ cookie hoặc localStorage
    const token = getCookie('token');

    // Kiểm tra đường dẫn hiện tại
    const path = request.nextUrl.pathname;
    const isProtectedPath = protectedPaths.some(route =>
        path === route || path.startsWith(`${route}/`)
    );

    // Chuyển hướng nếu chưa đăng nhập và đang truy cập vào trang được bảo vệ
    if (isProtectedPath && !token) {
        // Lưu URL hiện tại để quay lại sau khi đăng nhập
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', path);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();

}

// Chỉ định các patterns để kích hoạt middleware
export const config = {
    matcher: [
        '/home', // Khớp chính xác với /home
        '/home/:path*', // Khớp với /home/bất-kỳ-đường-dẫn-con
        '/yourbooking',
        '/yourbooking/:path*',
        '/profile',
        '/profile/:path*',
        // Pattern catch-all có thể gây ra vấn đề, hãy xem xét liệu có thực sự cần thiết
        // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};