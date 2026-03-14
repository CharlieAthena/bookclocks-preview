import { NextRequest, NextResponse } from 'next/server';

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_edition_key?: string;
  isbn?: string[];
  edition_key?: string[];
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[];
  numFound: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ books: [], total: 0 });
  }

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://openlibrary.org/search.json?q=${encoded}&limit=20&fields=key,title,author_name,first_publish_year,cover_edition_key,isbn,edition_key`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TheBookClocks/1.0 (contact@thebookclocks.com)' },
    });

    if (!response.ok) {
      throw new Error(`Open Library API returned ${response.status}`);
    }

    const data: OpenLibraryResponse = await response.json();

    const books = data.docs.map((doc) => {
      const coverId = doc.cover_edition_key || doc.edition_key?.[0] || null;
      const isbn = doc.isbn?.[0] || null;

      let coverUrl: string | null = null;
      if (coverId) {
        coverUrl = `https://covers.openlibrary.org/b/olid/${coverId}-L.jpg`;
      } else if (isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      }

      return {
        key: doc.key,
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown Author',
        year: doc.first_publish_year || null,
        coverId,
        isbn,
        coverUrl,
      };
    });

    return NextResponse.json({ books, total: data.numFound });
  } catch (error) {
    console.error('Open Library search error:', error);
    return NextResponse.json(
      { error: 'Failed to search books. Please try again.' },
      { status: 500 }
    );
  }
}
