import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { load } from 'cheerio';

async function getDynamicToken() {
    const response = await fetch('https://dontopup.id/cekid', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the check ID page to get a token. The site might be blocking the request.');
    }
    const html = await response.text();
    const $ = load(html);

    let token = null;
    $('script').each((i, el) => {
        const scriptContent = $(el).html();
        if (scriptContent && scriptContent.includes('X-Encrypted-Token')) {
            const match = scriptContent.match(/"X-Encrypted-Token":\s*"([^"]+)"/);
            if (match && match[1]) {
                token = match[1];
                return false; 
            }
        }
    });

    if (!token) {
        throw new Error('Could not find X-Encrypted-Token on the page.');
    }
    return token;
}

export default {
  category: 'stalk-game',
  name: 'ML-Region',
  description: 'Stalk Mobile Legends account region',
  parameters: [
    { name: 'userid', description: 'User ID Mobile Legends', required: true },
    { name: 'zoneid', description: 'Zone ID Mobile Legends', required: true }
  ],
  async execute({ userid, zoneid }) {
    if (!userid || !zoneid) {
      throw new Error("Parameters 'userid' and 'zoneid' are required.");
    }

    const dynamicToken = await getDynamicToken();
    const payload = new URLSearchParams({ userid, zoneid });
    
    const response = await fetch('https://dontopup.id/ajax/cek_id.php', {
      method: 'POST',
      headers: {
        'X-Encrypted-Token': dynamicToken,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
      body: payload
    });

    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.message !== "ID Ditemukan") {
        throw new Error(data.message || 'Failed to get data. Check your User ID and Zone ID.');
    }

    return {
      creator: "Odzreshop",
      result: data.data
    };
  }
};
