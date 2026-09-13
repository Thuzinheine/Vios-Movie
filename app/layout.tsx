import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CineJoy - Movies & TV Streaming Hub',
  description: 'A modern streaming interface for discovering movies and TV shows powered by TMDB data, featuring provider filters, trailers, and personal watchlist.',
  openGraph: {
    title: 'CineJoy - Movies & TV Streaming Hub',
    description: 'A modern streaming interface for discovering movies and TV shows powered by TMDB data, featuring provider filters, trailers, and personal watchlist.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineJoy - Movies & TV Streaming Hub',
    description: 'A modern streaming interface for discovering movies and TV shows powered by TMDB data, featuring provider filters, trailers, and personal watchlist.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
