import { OrderKuota } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Withdraw-QRIS',
  description: 'Withdraw QRIS balance to main balance',
  method: 'GET',
  parameters: [
    { name: 'username', description: 'Your Orderkuota username', required: true },
    { name: 'token', description: 'Your Auth Token', required: true },
    { name: 'amount', description: 'Amount to withdraw', required: true }
  ],
  async execute({ username, token, amount }) {
    if (!username || !token || !amount) throw new Error("Username, Token, and Amount are required.");
    const ok = new OrderKuota(username, token);
    const wd = await ok.withdrawalQris(amount);
    if (!wd || !wd.qris_withdraw) {
        throw new Error(wd.message || 'Withdrawal process failed.');
    }
    return { creator: "Odzreshop", result: wd.qris_withdraw };
  }
};
