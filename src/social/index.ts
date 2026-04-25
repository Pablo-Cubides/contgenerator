import { generateTwitterThread } from './adapters/twitter';
import { generateLinkedInPost } from './adapters/linkedin';
import { generateFacebookPost } from './adapters/facebook';
import { generateInstagramContent } from './adapters/instagram';
import { generateTikTokScript } from './adapters/tiktok';

export async function amplifyContent(filePath: string, url: string = "[LINK]") {
  const twitter = await generateTwitterThread(filePath, url);
  const linkedin = await generateLinkedInPost(filePath, url);
  const facebook = await generateFacebookPost(filePath, url);
  const instagram = await generateInstagramContent(filePath, url);
  const tiktok = await generateTikTokScript(filePath, url);

  return {
    twitter,
    linkedin,
    facebook,
    instagram,
    tiktok
  };
}
