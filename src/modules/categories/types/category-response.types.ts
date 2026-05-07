export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface CategoryProductsResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  products: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    imageUrl?: string;
  }[];
}
