import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit bir in-memory rate limiting implementasyonu
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_SIZE = 60 * 1000; // 1 dakika
const MAX_REQUESTS = 60; // dakikada maksimum 60 istek

export async function middleware(request: NextRequest) {
  // Sadece API rotalarına rate limiting uygula
  if (request.nextUrl.pathname.startsWith('/api')) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') ?? '127.0.0.1';
    const now = Date.now();
    const windowData = rateLimit.get(ip);

    if (windowData === undefined) {
      // İlk istek
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else {
      if (now - windowData.timestamp > WINDOW_SIZE) {
        // Zaman penceresi geçmiş, sıfırla
        rateLimit.set(ip, { count: 1, timestamp: now });
      } else if (windowData.count >= MAX_REQUESTS) {
        // Rate limit aşıldı
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Lütfen bir dakika bekleyip tekrar deneyin.',
          },
          { 
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Limit': MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(windowData.timestamp + WINDOW_SIZE).toISOString(),
            }
          }
        );
      } else {
        // İstek sayısını artır
        windowData.count++;
        rateLimit.set(ip, windowData);
      }
    }

    // Rate limit headers ekle
    const headers = new Headers();
    const currentWindowData = rateLimit.get(ip)!;
    headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
    headers.set('X-RateLimit-Remaining', (MAX_REQUESTS - currentWindowData.count).toString());
    headers.set('X-RateLimit-Reset', new Date(currentWindowData.timestamp + WINDOW_SIZE).toISOString());

    // API güvenlik başlıkları
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    const response = NextResponse.next();
    
    // Transfer all headers to the response
    headers.forEach((value, key) => {
        response.headers.set(key, value);
    });
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
