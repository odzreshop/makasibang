import { point_blank } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Point Blank',
  description: 'Stalk ID Game Point Blank',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await point_blank(userId);
    return { creator: "Odzreshop", ...data };
  }
};
