import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token'); // 假设通过 Cookie 检查登录状态

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url)); // 重定向到登录页
    }
}