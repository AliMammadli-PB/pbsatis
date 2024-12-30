// Price Validation Algorithm

export const validatePrice = (price: string): boolean => {
  // Fiyat boş olmamalı
  if (!price) {
    return false;
  }

  // Fiyat sayısal bir değer olmalı
  const numericPrice = Number(price);
  
  // Fiyat sayısal olmalı ve 0'dan büyük olmalı
  return !isNaN(numericPrice) && numericPrice > 0;
};

export const DEFAULT_CURRENCY = 'AZN';

export const handlePriceSubmit = (price: string, currency: string = DEFAULT_CURRENCY) => {
  try {
    if (!validatePrice(price)) {
      throw new Error('Lütfen geçerli bir fiyat girin');
    }

    // Fiyat ve para birimini işleme alma
    const processedPrice = {
      value: Number(price),
      currency: currency
    };

    return processedPrice;
  } catch (error) {
    console.error('Fiyat hatası:', error);
    return null;
  }
};
