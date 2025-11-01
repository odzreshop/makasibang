import { OrderKuota } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Get-Mutasi',
  description: 'Check QRIS transaction history on Orderkuota',
  method: 'GET',
  parameters: [
    { name: 'username', description: 'Your Orderkuota username', required: true },
    { name: 'token', description: 'Your Auth Token', required: true }
  ],
  async execute({ username, token }) {
    if (!username || !token) throw new Error("Username and Token are required.");
    const ok = new OrderKuota(username, token);
    const data = await ok.getTransactionQris();

    if (!data || !data.qris_history || !Array.isArray(data.qris_history.results)) {
        throw new Error(data.message || 'Failed to get transaction history. Check username and token.');
    }

    const filtered = data.qris_history.results.filter(e => e.status === "IN");
    return { creator: "Odzreshop", result: filtered };
  }
};
