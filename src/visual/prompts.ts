export const VISUAL_PROMPTS = {
  OG_IMAGE: (title: string, keyword: string, colors: string, url: string) => 
    `A professional, high-fidelity blog header visually representing ${keyword}. Modern and clean style using ${colors}. ${title ? `Include the text '${title}' in a sleek font.` : ''} Add a subtle 'Read more at: ${url}' in the corner. Photorealistic cinematic lighting, 16:9 aspect ratio.`,
  
  CAROUSEL_SLIDE: (text: string, colors: string, url: string) => 
    `A vibrant and minimalist social media slide. Features a 3D icon or illustration for: '${text}'. Use brand colors: ${colors}. ${url ? `Include '${url}' as a small watermark.` : ''} High-quality 3D render, 1:1 aspect ratio.`,
  
  INFOGRAPHIC: (topic: string, colors: string, url: string) => 
    `A clean, vertical infographic layout about '${topic}'. Professional corporate aesthetic using ${colors}. Includes a clear call-to-action area at the bottom with: 'Visit ${url} for the full guide'. 9:16 aspect ratio.`
};
