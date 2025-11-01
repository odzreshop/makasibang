import fetch from 'node-fetch';
import { load } from 'cheerio';

async function tiktokStalk(username) {
  const response = await fetch(`https://www.tiktok.com/@${username}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });

  if (!response.ok) {
      throw new Error(`Failed to fetch profile. Status: ${response.status}`);
  }

  const html = await response.text();
  const $ = load(html);
  const rawData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();

  if (!rawData) {
      throw new Error('Could not find user data on the page. The user might not exist or TikTok changed their layout.');
  }
  
  const parsed = JSON.parse(rawData);
  const scope = parsed?.['__DEFAULT_SCOPE__']?.['webapp.user-detail'];

  if (!scope || scope.statusCode !== 0) {
    throw new Error('User not found or profile is private.');
  }

  const info = scope.userInfo;
  const user = info.user;
  const stats = info.stats;

  return {
    id: user.id,
    uniqueId: user.uniqueId,
    nickname: user.nickname,
    avatar: user.avatarLarger,
    verified: user.verified,
    signature: user.signature,
    region: user.region,
    following: stats.followingCount,
    followers: stats.followerCount,
    likes: stats.heart,
    videos: stats.videoCount
  };
}

export default {
  category: 'stalk-account',
  name: 'Tiktok-Stalk',
  description: 'Stalking a TikTok username',
  parameters: [
    { name: 'username', description: 'TikTok username (without @)', required: true }
  ],
  async execute({ username }) {
    if (!username) {
      throw new Error("Parameter 'username' is required");
    }

    const result = await tiktokStalk(username);
    return {
      creator: "Odzreshop",
      result
    };
  }
};
