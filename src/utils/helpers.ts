export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80)
    .replace(/-$/, "");
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

export function calculateReadTime(text: string): string {
  const wordsPerMinute = 200;
  const words = countWords(text);
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de lectura`;
}
