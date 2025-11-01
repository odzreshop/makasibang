import { OrderKuota } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Get-Token',
  description: 'Get Auth Token from Orderkuota using OTP',
  method: 'GET',
  parameters: [
    { name: 'username', description: 'Your Orderkuota username', required: true },
    { name: 'otp', description: 'The OTP you received', required: true }
  ],
  async execute({ username, otp }) {
    if (!username || !otp) throw new Error("Username and OTP are required.");
    const ok = new OrderKuota();
    const result = await ok.getAuthToken(username, otp);
    if (!result || !result.results) {
        throw new Error(result.message || 'Failed to get Token. Check username and OTP.');
    }
    return { creator: "Odzreshop", result: result.results };
  }
};
