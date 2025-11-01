import { azur_lane } from '../../lib/game-checker.js';
export default {
  category: 'stalk-game',
  name: 'Azur Lane',
  description: 'Stalk ID Game Azur Lane. Zone ID: Avrora, Lexington, Sandy, Washington, Amagi, Little Enterprise',
  parameters: [{ name: 'userId', required: true }, { name: 'zoneId', required: true }],
  async execute({ userId, zoneId }) {
    if (!userId || !zoneId) throw new Error("Parameters 'userId' and 'zoneId' are required.");
    const data = await azur_lane(userId, zoneId);
    return { creator: "Odzreshop", ...data };
  }
};
