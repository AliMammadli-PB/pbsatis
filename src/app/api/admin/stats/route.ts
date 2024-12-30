import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalAccounts, activeAccounts, soldAccounts, totalRevenue] = await Promise.all([
      prisma.account.count(),
      prisma.account.count({
        where: {
          status: 'active'
        }
      }),
      prisma.account.count({
        where: {
          status: 'sold'
        }
      }),
      prisma.account.aggregate({
        _sum: {
          price: true
        },
        where: {
          status: 'sold'
        }
      })
    ]);

    return NextResponse.json({
      totalAccounts,
      activeAccounts,
      soldAccounts,
      totalRevenue: totalRevenue._sum.price || 0
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}