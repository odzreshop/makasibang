import { free_fire } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Free Fire',
  description: 'Stalk ID Game Free Fire',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await free_fire(userId);
    return { creator: "Odzreshop", ...data };
  }
};
