export interface Account {
  id: string;
  rank: string;
  rankImage: string;
  price: number;
  currency?: string;
  contactInfo: {
    discord?: string;
    telegram?: string;
    whatsapp?: string;
  };
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountFilters {
  rank?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'price' | 'date';
  sortOrder?: 'asc' | 'desc';
}