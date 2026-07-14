/**
 * Types for Weily E-commerce Store
 */

export type StockStatus = 'available' | 'low_stock' | 'out_of_stock';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  discount?: number; // percentage
  description: string;
  categoryId: string;
  stockStatus: StockStatus;
  stockCount: number;
  images: string[]; // Base64 or local paths
  isFeatured: boolean;
  isNew: boolean;
  isDeal: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface SiteConfig {
  siteName: string;
  whatsappPhone: string;
  currencySymbol: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  featuredProductsCount: number;
  outOfStockCount: number;
  newProductsCount: number;
}
