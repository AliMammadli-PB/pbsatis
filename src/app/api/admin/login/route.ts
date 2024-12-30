import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Örnek admin kullanıcısı (gerçek uygulamada veritabanından gelecek)
const ADMIN_USER = {
  username: 'admin',
  // Gerçek uygulamada hash'lenmiş şifre kullanılmalı
  password: '$2a$10$XFE/UQjM6PpV/gkqsj3ac.hw.1xG7yHwqgCy8nJqClW0YuHGX.z6i', // "admin123"
};

// Başarısız giriş denemelerini takip etmek için
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, password } = data;

    // IP adresi kontrolü (gerçek uygulamada request headers'dan alınmalı)
    const ip = '127.0.0.1';
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };

    // Hesap kilitli mi kontrol et
    if (attempts.count >= 3) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < 5 * 60 * 1000) { // 5 dakika
        return NextResponse.json({
          error: 'Çok fazla başarısız deneme. Hesap kilitlendi.',
          isLocked: true,
          remainingTime: 5 * 60 - Math.floor(timeSinceLastAttempt / 1000),
        }, { status: 429 });
      } else {
        // Kilit süresini sıfırla
        loginAttempts.delete(ip);
      }
    }

    // Kullanıcı adı kontrolü
    if (username !== ADMIN_USER.username) {
      updateLoginAttempts(ip);
      return NextResponse.json({
        error: 'Geçersiz kullanıcı adı veya şifre',
        remainingAttempts: 3 - (attempts.count + 1),
      }, { status: 401 });
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, ADMIN_USER.password);
    if (!isValidPassword) {
      updateLoginAttempts(ip);
      return NextResponse.json({
        error: 'Geçersiz kullanıcı adı veya şifre',
        remainingAttempts: 3 - (attempts.count + 1),
      }, { status: 401 });
    }

    // Başarılı giriş - JWT token oluştur
    const token = sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '1h' }
    );

    // Token'ı cookie olarak kaydet
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 saat
    });

    // Başarılı giriş sonrası giriş denemelerini sıfırla
    loginAttempts.delete(ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function updateLoginAttempts(ip: string) {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
} 