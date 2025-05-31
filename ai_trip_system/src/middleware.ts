// middleware.ts (đặt ở thư mục gốc của dự án)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các đường dẫn cần bảo vệ
const protectedPaths = [
    '/yourbooking',
    '/profile',
    '/home',
    // Thêm các trang khác cần bảo vệ
];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

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
        '/home',
        '/home/:path*',
        '/yourbooking',
        '/yourbooking/:path*',
        '/profile',
        '/profile/:path*',
    ],
};