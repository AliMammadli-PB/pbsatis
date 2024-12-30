export interface Account {
  id: string;
  rankImage: string;
  price: number;
  currency: string;
  contactInfo: {
    discord: string;
    telegram: string;
    whatsapp: string;
  };
  description: string;
  status: 'available' | 'sold' | 'reserved';
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountFormData {
  rankImage: File | string;
  price: string | number;
  currency: string;
  contactInfo: {
    discord: string;
    telegram: string;
    whatsapp: string;
  };
  description: string;
  status: Account['status'];
  images: File[];
}

export interface AccountFilters {
  rankImage?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  status?: Account['status'];
  searchQuery?: string;
  sortBy?: 'price' | 'date';
  sortOrder?: 'asc' | 'desc';
}
