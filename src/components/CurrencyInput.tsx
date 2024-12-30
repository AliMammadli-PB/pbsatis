'use client';

import React from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { handlePriceSubmit } from '@/utils/priceValidation';

export default function CurrencyInput() {
  const { value, currency, setValue, setCurrency } = useCurrencyStore();

  const handleValueChange = (inputValue: string) => {
    const result = handlePriceSubmit(inputValue, currency);
    
    if (result) {
      setValue(result.value.toString());
    } else {
      setValue(inputValue);
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        className="flex-grow p-2 border rounded-l"
        placeholder="Fiyat"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="p-2 border rounded-r"
      >
        <option value="AZN">₼</option>
        <option value="TRY">₺</option>
        <option value="USD">$</option>
        <option value="EUR">€</option>
      </select>
    </div>
  );
}
