import FormData from 'form-data';
import fetch from 'node-fetch';

async function uploadToOdzreCDN(fileBuffer, originalName) {
    const form = new FormData();
    form.append('file', fileBuffer, { filename: originalName });
    const response = await fetch('https://cdn.odzre.my.id/upload', {
        method: 'POST',
        body: form
    });
    if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`);
    const data = await response.json();
    if (!data.url) throw new Error('CDN did not return a valid URL.');
    return data;
}

export default {
  category: 'Uploader',
  name: 'Upload',
  description: "Upload an image via multipart/form-data. Use 'file' as the field name.",
  method: 'POST',
  parameters: [
    { name: 'file', description: 'Select an image to upload', required: true, type: 'file' }
  ], 
  async execute({ file }) {
    if (!file) {
      throw new Error("No file uploaded. Make sure to use 'file' as the field name.");
    }
    const result = await uploadToOdzreCDN(file.buffer, file.originalname);
    return { creator: "Odzreshop", ...result };
  }
};
