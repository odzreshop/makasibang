import { auto_chess } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Auto Chess',
  description: 'Stalk ID Game Auto Chess',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await auto_chess(userId);
    return { creator: "Odzreshop", ...data };
  }
};
