import { OrderKuota } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Profile',
  description: 'Check your Orderkuota profile',
  method: 'GET',
  parameters: [
    { name: 'username', description: 'Your Orderkuota username', required: true },
    { name: 'token', description: 'Your Auth Token', required: true }
  ],
  async execute({ username, token }) {
    if (!username || !token) throw new Error("Username and Token are required.");
    const ok = new OrderKuota(username, token);
    const profile = await ok.getAccountInfo();
    if (!profile || !profile.account || !profile.account.results) {
        throw new Error(profile.message || 'Failed to get profile. Check username and token.');
    }
    return { creator: "Odzreshop", result: profile.account.results };
  }
};
