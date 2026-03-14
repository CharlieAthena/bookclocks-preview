export interface Book {
  key: string;
  title: string;
  author: string;
  year: number | null;
  coverId: string | null;
  isbn: string | null;
  coverUrl: string | null;
  publisher: string | null;
  pages: number | null;
  clockScore: number; // 0-100, how good a fit this book is for a book clock
  clockBadge: string | null; // "Perfect Fit", "Great Cover", "Collector's Edition", etc.
}

export interface ClockConfig {
  book: Book;
  handStyle: string;
  handColor: string;
  handSize: 'small' | 'medium' | 'large';
  positionX: number;
  positionY: number;
  recipientName: string;
  giverName: string;
}

export interface HandStyle {
  id: string;
  name: string;
  svgHour: string;
  svgMinute: string;
  description: string;
  priceModifier: number;
}
