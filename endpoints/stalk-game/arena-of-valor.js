import { arena_of_valor } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Arena of Valor',
  description: 'Stalk ID Game Arena of Valor',
  parameters: [{ name: 'userId', required: true }],
  async execute({ userId }) {
    if (!userId) throw new Error("Parameter 'userId' is required.");
    const data = await arena_of_valor(userId);
    return { creator: "Odzreshop", ...data };
  }
};
