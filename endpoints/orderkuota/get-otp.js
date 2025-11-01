import { OrderKuota } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Get-OTP',
  description: 'Get OTP from Orderkuota',
  method: 'GET',
  parameters: [
    { name: 'username', description: 'Your Orderkuota username', required: true },
    { name: 'password', description: 'Your Orderkuota password', required: true }
  ],
  async execute({ username, password }) {
    if (!username || !password) throw new Error("Username and Password are required.");
    const ok = new OrderKuota();
    const result = await ok.loginRequest(username, password);
    if (!result || !result.results) {
        throw new Error(result.message || 'Failed to get OTP. Check credentials.');
    }
    return { creator: "Odzreshop", result: result.results };
  }
};
