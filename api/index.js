const crypto = require('crypto');

function parseSheetData(values) {
  if (!values || values.length < 2) return [];

  const headers = values[0].map(h => h.toLowerCase().trim());
  const orders = [];

  const dateIdx = headers.findIndex(h => h.includes('delivery date'));
  const nameIdx = headers.findIndex(h => h.includes('last name') && !h.includes('delivered'));
  const itemIdx = headers.findIndex(h => h.includes('line item'));
  const qtyIdx = headers.findIndex(h => h.includes('quantity') && !h.includes('individual'));
  const qtyIndividualIdx = headers.findIndex(h => h.includes('individual'));
  const deliveredToIdx = headers.findIndex(h => h.includes('delivered to'));
  const addressIdx = headers.findIndex(h => h.includes('delivery address'));
  const pickupIdx = headers.findIndex(h => h.includes('pickup'));
  const noteIdx = headers.findIndex(h => h.includes('customer note'));

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || !row[dateIdx]) continue;

    const itemsStr = row[itemIdx] || '';
    const qtyStr = row[qtyIdx] || '1';
    const qtyIndividualStr = row[qtyIndividualIdx] || '';

    const items = [];
    if (itemsStr) {
      const itemNames = itemsStr.split(',').map(i => i.trim()).filter(i => i);
      const quantities = qtyStr.split(',').map(q => {
        const parsed = parseInt(q.trim());
        return isNaN(parsed) ? 1 : parsed;
      });
      const qtyIndividuals = qtyIndividualStr.split(',').map(q => {
        const parsed = parseInt(q.trim());
        return isNaN(parsed) ? '' : parsed;
      });

      itemNames.forEach((name, idx) => {
        items.push({
          product: name,
          quantity: quantities[idx] || 1,
          quantityIndividual: qtyIndividuals[idx] || ''
        });
      });
    }

    if (items.length === 0) {
      items.push({ product: 'Unknown', quantity: 1, quantityIndividual: '' });
    }

    orders.push({
      deliveryDate: (row[dateIdx] || '').trim(),
      lastName: (row[nameIdx] || 'Unknown').trim(),
      deliveredTo: (row[deliveredToIdx] || '').trim(),
      items: items,
      address: (row[addressIdx] || '').trim(),
      pickupOrDelivery: (row[pickupIdx] || 'delivery').trim(),
      customerNote: (row[noteIdx] || '').trim()
    });
  }

  return orders.filter(o => o.deliveryDate && o.items.length > 0);
}

function createJWT(serviceAccount) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  function base64url(str) {
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  const headerStr = base64url(JSON.stringify(header));
  const payloadStr = base64url(JSON.stringify(payload));
  const signatureInput = `${headerStr}.${payloadStr}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = base64url(sign.sign(serviceAccount.private_key));

  return `${signatureInput}.${signature}`;
}

async function getAccessToken(serviceAccount) {
  try {
    const jwt = createJWT(serviceAccount);

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await response.json();
    if (!data.access_token) {
      throw new Error('Failed to get access token: ' + (data.error || 'Unknown error'));
    }
    return data.access_token;
  } catch (error) {
    throw new Error('Token error: ' + error.message);
  }
}

let storedServiceAccount = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/setup') {
    try {
      const { serviceAccount } = req.body;

      if (!serviceAccount || !serviceAccount.private_key) {
        res.status(400).json({ error: 'Invalid service account key' });
        return;
      }

      storedServiceAccount = serviceAccount;
      res.status(200).json({ success: true, message: 'Key stored' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'GET' && req.url === '/api/is-setup') {
    const envKey = process.env.SERVICE_ACCOUNT;
    const hasKey = (envKey || storedServiceAccount) ? true : false;
    res.status(200).json({ isSetup: hasKey });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/load-orders') {
    try {
      let serviceAccount;

      if (process.env.SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
      } else if (storedServiceAccount) {
        serviceAccount = storedServiceAccount;
      } else if (req.body.serviceAccount) {
        serviceAccount = req.body.serviceAccount;
      }

      if (!serviceAccount || !serviceAccount.private_key) {
        res.status(400).json({ error: 'Service account key not configured' });
        return;
      }

      const accessToken = await getAccessToken(serviceAccount);

      const sheetId = '1hW5nnsCyPVxNBXGV1CywgBaE1f9wMQxZEWk-rHu71hM';
      const range = 'Sheet1!A:L';

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Google Sheets error: ${response.status}`);
      }

      const data = await response.json();
      const orders = parseSheetData(data.values);

      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.url === '/api/create-google-doc' && req.method === 'POST') {
    try {
      let serviceAccount = null;

      if (process.env.SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
      } else if (storedServiceAccount) {
        serviceAccount = storedServiceAccount;
      } else if (req.body.serviceAccount) {
        serviceAccount = req.body.serviceAccount;
      }

      if (!serviceAccount || !serviceAccount.private_key) {
        res.status(400).json({ error: 'Service account key not configured' });
        return;
      }

      const { title, content } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and content required' });
        return;
      }

      const accessToken = await getAccessToken(serviceAccount);

      // Create a new Google Doc
      const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create Google Doc: ${createResponse.status}`);
      }

      const docData = await createResponse.json();
      const docId = docData.documentId;

      // Insert content into the document
      const insertResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: content,
                location: { index: 1 }
              }
            }
          ]
        })
      });

      if (!insertResponse.ok) {
        throw new Error(`Failed to insert content: ${insertResponse.status}`);
      }

      // Return the document URL
      const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
      res.status(200).json({ 
        success: true,
        docUrl: docUrl,
        docId: docId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.url === '/api/health') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
