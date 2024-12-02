export interface GalleryItem {
  id: number;
  title: string;
  category: 'education' | 'environment' | 'elderly' | 'community';
  date: string;
  imageUrl: string;
  description?: string;
}

export type GalleryCategory = 'all' | GalleryItem['category'];
