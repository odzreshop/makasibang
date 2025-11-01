import { hago } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Hago',
  description: 'Stalk ID Game Hago',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await hago(userId);
    return { creator: "Odzreshop", ...data };
  }
};
