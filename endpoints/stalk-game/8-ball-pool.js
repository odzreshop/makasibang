import { eight_ball_pool } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: '8 Ball Pool',
  description: 'Stalk ID Game 8 Ball Pool',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await eight_ball_pool(userId);
    return { creator: "Odzreshop", ...data };
  }
};
