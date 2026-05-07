import { Injectable } from '@nestjs/common';
import { StorefrontHomeResponse } from './types/storefront-home.types';

@Injectable()
export class StorefrontService {
  getHome(): StorefrontHomeResponse {
    return {
      store: {
        name: 'Digital Commerce',
        logoUrl: '/brand/logo.svg',
      },
      hero: {
        mediaType: 'IMAGE',
        mediaUrl: '/demo/hero.jpg',
        title: 'New Season Essentials',
        subtitle: 'Premium streetwear for modern commerce.',
      },
      categories: [
        {
          id: 'men',
          name: 'Men',
          slug: 'men',
        },
        {
          id: 'women',
          name: 'Women',
          slug: 'women',
        },
      ],
      featuredProducts: [
        {
          id: 'oversized-black-hoodie',
          name: 'Oversized Black Hoodie',
          slug: 'oversized-black-hoodie',
          priceCents: 7900,
          imageUrl: '/demo/products/black-hoodie.jpg',
        },
        {
          id: 'cropped-white-tee',
          name: 'Cropped White Tee',
          slug: 'cropped-white-tee',
          priceCents: 3900,
          imageUrl: '/demo/products/white-tee.jpg',
        },
      ],
    };
  }
}
