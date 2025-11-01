import { call_of_duty } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Call of Duty',
  description: 'Stalk ID Game Call of Duty Mobile',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await call_of_duty(userId);
    return { creator: "Odzreshop", ...data };
  }
};
