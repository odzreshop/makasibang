import { createQRIS } from '../../lib/orkut.js';
export default {
  category: 'Orderkuota',
  name: 'Create-Payment',
  description: 'Generate QRIS Payment with custom amount',
  method: 'GET',
  parameters: [
    { name: 'amount', description: 'Payment amount', required: true },
    { name: 'codeqr', description: 'Your static QRIS code from Orderkuota', required: true }
  ],
  async execute({ amount, codeqr }) {
    if (!amount || !codeqr) throw new Error("Amount and QR Code are required.");
    const qrData = await createQRIS(amount, codeqr);
    return { creator: "Odzreshop", result: qrData };
  }
};
