export type HeroMediaType = 'IMAGE' | 'VIDEO';

export interface StorefrontHomeResponse {
  store: {
    name: string;
    logoUrl: string;
  };
  hero: {
    mediaType: HeroMediaType;
    mediaUrl: string;
    posterUrl?: string;
    title: string;
    subtitle: string;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  featuredProducts: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    imageUrl: string;
  }[];
}
