import * as cheerio from 'cheerio';

export interface SerpResult {
  title: string;
  link: string;
  snippet: string;
}

export async function fetchAutocomplete(keyword: string): Promise<string[]> {
  try {
    const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    console.error("[Error Autocomplete]", error);
    return [];
  }
}

export async function fetchSerp(keyword: string): Promise<SerpResult[]> {
  try {
    const response = await fetch(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const results: SerpResult[] = [];

    $('.g').each((i, el) => {
      const title = $(el).find('h3').text();
      const link = $(el).find('a').attr('href');
      const snippet = $(el).find('.VwiC3b').text();

      if (title && link) {
        results.push({ title, link, snippet });
      }
      if (results.length >= 10) return false;
    });

    return results;
  } catch (error) {
    console.error("[Error SERP]", error);
    return [];
  }
}
