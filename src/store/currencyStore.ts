import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  value: string;
  currency: string;
  setValue: (newValue: string) => void;
  setCurrency: (newCurrency: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      value: '',
      currency: 'USD',
      setValue: (newValue) => set({ value: newValue }),
      setCurrency: (newCurrency) => set({ currency: newCurrency }),
    }),
    {
      name: 'currency-storage', // name of the item in storage
    }
  )
);
