import { mobile_legends } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Mobile Legends',
  description: 'Stalk ID Game Mobile Legends',
  parameters: [{ name: 'userId', required: true }, { name: 'zoneId', required: true }],
  async execute({ userId, zoneId }) {
    if (!userId || !zoneId) throw new Error("Parameters 'userId' and 'zoneId' are required.");
    const data = await mobile_legends(userId, zoneId);
    return { creator: "Odzreshop", ...data };
  }
};
