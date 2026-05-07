export interface ProductListResponse {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt?: string;
  }[];
  variants: {
    id: string;
    name: string;
    sku?: string;
    size?: string;
    color?: string;
    stock: number;
    priceCents?: number;
  }[];
}
