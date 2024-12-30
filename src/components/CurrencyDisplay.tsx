'use client';

import React from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export default function CurrencyDisplay() {
  const { value, currency } = useCurrencyStore();

  const currencySymbols: { [key: string]: string } = {
    'AZN': '₼',
    'TRY': '₺',
    'USD': '$',
    'EUR': '€'
  };

  if (!value) return null;

  return (
    <div className="mt-2 text-lg font-semibold">
      Current Amount: {value} {currencySymbols[currency]}
    </div>
  );
}
