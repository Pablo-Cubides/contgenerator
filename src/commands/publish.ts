import { publishToPostiz } from '../publish/postiz-publisher';

export async function runPublish(mediaPackPath: string, options: { platforms?: string, schedule?: boolean }) {
  const platforms = options.platforms ? options.platforms.split(',') : ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'];
  
  if (options.schedule) {
    console.log("📅 Scheduling posts for optimal times...");
  } else {
    console.log("🚀 Publishing immediately...");
  }

  await publishToPostiz(mediaPackPath, platforms);
}
