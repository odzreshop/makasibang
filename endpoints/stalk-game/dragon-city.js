import { dragon_city } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Dragon City',
  description: 'Stalk ID Game Dragon City',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await dragon_city(userId);
    return { creator: "Odzreshop", ...data };
  }
};
