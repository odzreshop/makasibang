import fetch from 'node-fetch';
export default {
  category: 'stalk-game',
  name: 'Roblox',
  description: 'Stalk a Roblox account by username',
  parameters: [ { name: 'username', description: 'Roblox username', required: true } ],
  async execute({ username }) {
    if (!username) { throw new Error("Parameter 'username' is required"); }
    const searchRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true })
    });
    const searchData = await searchRes.json();
    if (!searchData.data || searchData.data.length === 0) { throw new Error("User not found on Roblox."); }
    const userId = searchData.data[0].id;
    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profile = await profileRes.json();
    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
    const avatarData = await avatarRes.json();
    const avatarUrl = avatarData.data && avatarData.data[0] ? avatarData.data[0].imageUrl : null;
    return { creator: "Odzreshop", result: { userId, name: profile.name, displayName: profile.displayName, description: profile.description, created: profile.created, isBanned: profile.isBanned, avatar: avatarUrl } };
  }
};
