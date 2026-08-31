const crypto = require('crypto');

const KNOWN_PRODUCT_SKUS = [
  "12\" sliced platter",
  "14\" sliced platter",
  "14x14",
  "14x21",
  "14x21 - Plus",
  "14x21 - Standard",
  "16\" sliced platter",
  "16\" sliced platter - Grand",
  "16\" sliced platter - Plus",
  "16\" sliced platter - Standard",
  "16x16",
  "16x16 - Grand",
  "16x16 - Plus",
  "16x16 - Standard",
  "18x18",
  "18x18 - Grand",
  "18x18 - Standard",
  "2 oz Fruit Cups",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 12",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 16",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 24",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 32",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 36",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 40",
  "2 oz Fruit Cups - Assorted Melons and Pineapple - 48",
  "2 oz Fruit Cups - Kiwi - 12",
  "2 oz Fruit Cups - Kiwi - 24",
  "2 oz Fruit Cups - Mango - 12",
  "2 oz Fruit Cups - Mango - 24",
  "2 oz glass cups",
  "2 oz glass cups - Assorted Melons and Pineapple - 24",
  "2 oz glass cups - Assorted Melons and Pineapple - 36",
  "2 oz glass cups - Assorted Melons and Pineapple - 48",
  "2 oz glass cups - Kiwi - 12",
  "2 oz glass cups - Mango - 12",
  "3 oz covered cups",
  "3 oz covered cups - Assorted Melons and Pineapple - 12",
  "3 oz covered cups - Assorted Melons and Pineapple - 24",
  "3 oz covered cups - Assorted Melons and Pineapple - 36",
  "3 oz covered cups - Assorted Melons and Pineapple - 48",
  "3 oz covered cups - Kiwi - 12",
  "3 oz covered cups - Mango - 12",
  "8 oz glass cups",
  "8 oz glass cups - Assorted Melons and Pineapple - 12",
  "8 oz glass cups - Kiwi - 12",
  "8 oz glass cups - Mango - 12",
  "8x14",
  "Acai Minis",
  "Acai Trays",
  "Acai Trays - Large",
  "Acai Trays - Medium",
  "Acai Trays - Small",
  "Barbeque Corn Nut Salad",
  "Barbeque Corn Nut Salad - Large - Pan",
  "Barbeque Corn Nut Salad - Large - Tray",
  "Barbeque Corn Nut Salad - Medium - Pan",
  "Barbeque Corn Nut Salad - Medium - Tray",
  "Barbeque Corn Nut Salad - Small - Rosebowl",
  "Basic Simcha Package",
  "Broccoli Cabbage Salad",
  "Broccoli Cabbage Salad - Large - Pan",
  "Broccoli Cabbage Salad - Large - Tray",
  "Broccoli Cabbage Salad - Medium - Pan",
  "Broccoli Cabbage Salad - Medium - Tray",
  "Broccoli Cabbage Salad - Small - Rosebowl",
  "Broccoli Salad",
  "Broccoli Salad - Large - Pan",
  "Broccoli Salad - Large - Tray",
  "Broccoli Salad - Medium - Pan",
  "Broccoli Salad - Medium - Tray",
  "Broccoli Salad - Small - Rosebowl",
  "Caesar Salad",
  "Caesar Salad - Large - Pan",
  "Caesar Salad - Large - Tray",
  "Caesar Salad - Medium - Pan",
  "Caesar Salad - Medium - Tray",
  "Caesar Salad - Small - Rosebowl",
  "Citrus Salad",
  "Citrus Salad - Large - Pan",
  "Citrus Salad - Large - Tray",
  "Citrus Salad - Medium - Pan",
  "Citrus Salad - Medium - Tray",
  "Citrus Salad - Small - Rosebowl",
  "Cubed Fruit",
  "Cubed Fruit - 2 lb container - Canteloupe - Bite Sized",
  "Cubed Fruit - 2 lb container - Canteloupe - Diced",
  "Cubed Fruit - 2 lb container - Honeydew - Bite Sized",
  "Cubed Fruit - 2 lb container - Honeydew - Diced",
  "Cubed Fruit - 2 lb container - Mango - Bite Sized",
  "Cubed Fruit - 2 lb container - Mango - Diced",
  "Cubed Fruit - 2 lb container - Pineapple - Bite Sized",
  "Cubed Fruit - 2 lb container - Pineapple - Diced",
  "Cubed Fruit - 2 lb container - Watermelon - Bite Sized",
  "Cubed Fruit - 2 lb container - Watermelon - Diced",
  "Cubed Fruit - 9x13 pan - 2 pans- 4 melons - Bite Sized",
  "Cubed Fruit - 9x13 pan - 2 pans- 4 melons - Diced",
  "Cubed Fruit - 9x13 pan - Canteloupe - Bite Sized",
  "Cubed Fruit - 9x13 pan - Canteloupe - Diced",
  "Cubed Fruit - 9x13 pan - Honeydew - Bite Sized",
  "Cubed Fruit - 9x13 pan - Honeydew - Diced",
  "Cubed Fruit - 9x13 pan - Mango - Bite Sized",
  "Cubed Fruit - 9x13 pan - Mango - Diced",
  "Cubed Fruit - 9x13 pan - Pineapple - Bite Sized",
  "Cubed Fruit - 9x13 pan - Pineapple - Diced",
  "Cubed Fruit - 9x13 pan - Watermelon - Bite Sized",
  "Cubed Fruit - 9x13 pan - Watermelon - Diced",
  "Decorative Cubed Platter",
  "Decorative Cubed Platter - Extra Large",
  "Decorative Cubed Platter - Large",
  "Decorative Cubed Platter - Medium",
  "Decorative Cubed Platter - Small",
  "Deluxe Simcha Package",
  "Exotic Fruit Platter",
  "Exotic Fruit Platter - Large",
  "Exotic Fruit Platter - Medium",
  "Exotic Fruit Platter - Small",
  "Feta Cheese Greek Salad (Dairy)",
  "Feta Cheese Greek Salad (Dairy) - Large - Pan",
  "Feta Cheese Greek Salad (Dairy) - Large - Tray",
  "Feta Cheese Greek Salad (Dairy) - Medium - Pan",
  "Feta Cheese Greek Salad (Dairy) - Medium - Tray",
  "Feta Cheese Greek Salad (Dairy) - Small - Rosebowl",
  "Feta Mushroom Salad (Dairy)",
  "Feta Mushroom Salad (Dairy) - Large - Pan",
  "Feta Mushroom Salad (Dairy) - Large - Tray",
  "Feta Mushroom Salad (Dairy) - Medium - Pan",
  "Feta Mushroom Salad (Dairy) - Medium - Tray",
  "Feta Mushroom Salad (Dairy) - Small - Rosebowl",
  "Fruit Cake (Available Monday-Wednesday only)",
  "Glass Salad Cups",
  "Glass Salad Cups - 12 - Cabbage",
  "Glass Salad Cups - 12 - Ceasar",
  "Glass Salad Cups - 12 - Citrus",
  "Glass Salad Cups - 12 - Greek",
  "Glass Salad Cups - 12 - Mango",
  "Glass Salad Cups - 12 - Mushroom",
  "Glass Salad Cups - 12 - Nish Nosh",
  "Glass Salad Cups - 12 - Quinoa",
  "Greek (Parve) Salad",
  "Greek (Parve) Salad - Large - Pan",
  "Greek (Parve) Salad - Large - Tray",
  "Greek (Parve) Salad - Medium - Pan",
  "Greek (Parve) Salad - Medium - Tray",
  "Greek (Parve) Salad - Small - Rosebowl",
  "Hearts of Palm Salad",
  "Hearts of Palm Salad - Large - Pan",
  "Hearts of Palm Salad - Large - Tray",
  "Hearts of Palm Salad - Medium - Pan",
  "Hearts of Palm Salad - Medium - Tray",
  "Hearts of Palm Salad - Small - Rosebowl",
  "L'chaim/Sweet Table Package",
  "Lucite Fruit Tray",
  "Mango Pomegranate Salad",
  "Mango Pomegranate Salad - Large - Pan",
  "Mango Pomegranate Salad - Large - Tray",
  "Mango Pomegranate Salad - Medium - Pan",
  "Mango Pomegranate Salad - Medium - Tray",
  "Mango Pomegranate Salad - Small - Rosebowl",
  "Nish Nosh Salad",
  "Nish Nosh Salad - Large - Pan",
  "Nish Nosh Salad - Large - Tray",
  "Nish Nosh Salad - Medium - Pan",
  "Nish Nosh Salad - Medium - Tray",
  "Nish Nosh Salad - Small - Rosebowl",
  "Onion Caesar Salad",
  "Onion Caesar Salad - Large - Pan",
  "Onion Caesar Salad - Large - Tray",
  "Onion Caesar Salad - Medium - Pan",
  "Onion Caesar Salad - Medium - Tray",
  "Onion Caesar Salad - Small - Rosebowl",
  "Portabella Mushroom Salad",
  "Portabella Mushroom Salad - Large - Pan",
  "Portabella Mushroom Salad - Large - Tray",
  "Portabella Mushroom Salad - Medium - Pan",
  "Portabella Mushroom Salad - Medium - Tray",
  "Portabella Mushroom Salad - Small - Rosebowl",
  "Purple Cabbage Salad",
  "Purple Cabbage Salad - Large - Pan",
  "Purple Cabbage Salad - Large - Tray",
  "Purple Cabbage Salad - Medium - Pan",
  "Purple Cabbage Salad - Medium - Tray",
  "Purple Cabbage Salad - Small - Rosebowl",
  "Quinoa (Lettuce) Salad",
  "Quinoa (Lettuce) Salad - Large - Pan",
  "Quinoa (Lettuce) Salad - Large - Tray",
  "Quinoa (Lettuce) Salad - Medium - Pan",
  "Quinoa (Lettuce) Salad - Medium - Tray",
  "Quinoa (Lettuce) Salad - Small - Rosebowl",
  "Ramen Sesame Salad",
  "Ramen Sesame Salad - Large - Pan",
  "Ramen Sesame Salad - Large - Tray",
  "Ramen Sesame Salad - Medium - Pan",
  "Ramen Sesame Salad - Medium - Tray",
  "Ramen Sesame Salad - Small - Rosebowl",
  "Salad Dressing",
  "Salad Dressing - Cabbage",
  "Salad Dressing - Caesar",
  "Salad Dressing - Mango",
  "Salad Dressing - Nish Nosh",
  "Salad Dressing - Portabella",
  "Salad Dressing - Quinoa",
  "Sectional",
  "Set of Lucites",
  "Shechaynu Platter",
  "Shehechyanu Fruit Board",
  "Simanim Salad",
  "Small Simcha Package",
  "Smoothies",
  "Smoothies - Assorted - 15",
  "Smoothies - Assorted - 24",
  "Smoothies - Assorted - 30",
  "Smoothies - Assorted - 36",
  "Smoothies in Glass cups",
  "Smoothies in Glass cups - Assorted - 24",
  "Smoothies in Glass cups - Assorted - 36",
  "Smoothies in Glass cups - Assorted - 48",
  "Sushi Salad",
  "Sushi Salad - Large - Pan",
  "Sushi Salad - Large - Tray",
  "Sushi Salad - Medium - Pan",
  "Sushi Salad - Medium - Tray",
  "Sushi Salad - Small - Rosebowl",
  "Sweet Potato Salad",
  "Sweet Potato Salad - Large - Pan",
  "Sweet Potato Salad - Large - Tray",
  "Sweet Potato Salad - Medium - Pan",
  "Sweet Potato Salad - Medium - Tray",
  "Sweet Potato Salad - Small - Rosebowl",
  "Tu B'shvat",
  "Tu B'shvat - Flower Board Dried Fruit",
  "Tu B'shvat - Fresh Fruit Board",
  "Tu B'shvat - Lined Board Dried Fruit",
  "Tu B'shvat - Mini Dried Fruit Board",
  "Tu B'shvat - Mini Fresh Fruit Board",
  "Tu B'shvat - Tu B'shvat Salad",
  "Upgraded L'chaim/Sweet Table Package",
  "Upgraded Simcha Package",
  "salad cups",
  "salad cups - 12 - Cabbage",
  "salad cups - 12 - Ceasar",
  "salad cups - 12 - Citrus",
  "salad cups - 12 - Greek",
  "salad cups - 12 - Mango",
  "salad cups - 12 - Mushroom",
  "salad cups - 12 - Nish Nosh",
  "salad cups - 12 - Quinoa"
];


// Runs `fn` over `items` with at most `limit` requests in flight at once —
// fast (parallel), but bounded so we don't hammer a modest WordPress host.
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current], current);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

let productsCache = null; // { skus: [...], fetchedAt: <ms> }
const PRODUCTS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let priceCache = null; // { prices: { sku: price }, variableProductIds: [...], fetchedAt: <ms> }
const PRICE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let variationPriceCache = {}; // productId -> { prices: { sku: price }, fetchedAt: <ms> }
const VARIATION_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function wcAuthHeader(consumerKey, consumerSecret) {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return { Authorization: `Basic ${auth}` };
}

async function wcGetJson(url, authHeader) {
  const resp = await fetch(url, { headers: authHeader });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`WooCommerce error ${resp.status} at ${url}: ${body.slice(0, 300)}`);
  }
  return resp;
}

function addWcPrice(prices, sku, p) {
  if (!sku) return;
  const price = parseFloat(p.price !== undefined && p.price !== '' ? p.price : p.regular_price);
  if (!isNaN(price)) prices[sku] = price;
}

// Step 1 of the price feature: fetch ONLY the top-level products list (a
// handful of paginated calls, no per-product variation calls) and return
// prices for simple products immediately, plus the id list of variable
// products still needing their variations fetched. This alone used to be
// fast and reliable even when the full fetch (below) wasn't — the timeouts
// on this store have consistently come from firing one variations call per
// variable product all at once inside a single function invocation, not
// from the products list itself.
async function fetchSimpleWooCommercePrices(baseUrl, consumerKey, consumerSecret) {
  const authHeader = wcAuthHeader(consumerKey, consumerSecret);

  const firstResp = await wcGetJson(`${baseUrl}/wp-json/wc/v3/products?per_page=100&page=1`, authHeader);
  const totalPages = parseInt(firstResp.headers.get('x-wp-totalpages') || '1', 10);
  const firstPageProducts = await firstResp.json();

  const extraPageNumbers = [];
  for (let page = 2; page <= totalPages; page++) extraPageNumbers.push(page);
  const extraPages = await Promise.all(extraPageNumbers.map(async (page) => {
    const resp = await wcGetJson(`${baseUrl}/wp-json/wc/v3/products?per_page=100&page=${page}`, authHeader);
    return resp.json();
  }));

  const allProducts = firstPageProducts.concat(...extraPages);

  const prices = {};
  const variableProductIds = [];
  allProducts.forEach(p => {
    if (p.type === 'variable') {
      variableProductIds.push(p.id);
    } else {
      addWcPrice(prices, p.sku, p);
    }
  });

  return { prices, variableProductIds };
}

// Step 2: fetch variation prices for a small, caller-supplied batch of
// variable product ids (not the whole catalog at once) — small enough that
// even a slow response from this store's API stays well inside the
// function timeout. The client drives this in batches; see
// loadProductPrices() in index.html.
async function fetchWooCommerceVariationPrices(baseUrl, consumerKey, consumerSecret, productIds) {
  const authHeader = wcAuthHeader(consumerKey, consumerSecret);
  const prices = {};

  const variationLists = await Promise.all(productIds.map(async (id) => {
    try {
      const resp = await wcGetJson(`${baseUrl}/wp-json/wc/v3/products/${id}/variations?per_page=100`, authHeader);
      return resp.json();
    } catch (e) {
      return [];
    }
  }));
  variationLists.forEach(variations => {
    variations.forEach(v => addWcPrice(prices, v.sku, v));
  });

  return prices;
}

async function fetchAllWooCommerceSkus(baseUrl, consumerKey, consumerSecret) {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const authHeader = { Authorization: `Basic ${auth}` };

  async function getJson(url) {
    const resp = await fetch(url, { headers: authHeader });
    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`WooCommerce error ${resp.status} at ${url}: ${body.slice(0, 300)}`);
    }
    return resp;
  }

  // Only the top-level products (simple + variable) come back here — trimming
  // to just the 3 fields we actually use keeps this response small and fast.
  const firstResp = await getJson(`${baseUrl}/wp-json/wc/v3/products?per_page=100&page=1`);
  const totalPages = parseInt(firstResp.headers.get('x-wp-totalpages') || '1', 10);
  const firstPageProducts = await firstResp.json();

  const extraPageNumbers = [];
  for (let page = 2; page <= totalPages; page++) extraPageNumbers.push(page);
  const extraPages = await Promise.all(extraPageNumbers.map(async (page) => {
    const resp = await getJson(`${baseUrl}/wp-json/wc/v3/products?per_page=100&page=${page}`);
    return resp.json();
  }));

  const allProducts = firstPageProducts.concat(...extraPages);

  const skus = [];
  const variableProducts = [];
  allProducts.forEach(p => {
    if (p.type === 'variable') {
      variableProducts.push(p);
    } else if (p.sku) {
      skus.push(p.sku);
    }
  });

  // The slow part: one variations call per variable product. Fire every one
  // of them at once (trimmed to just id+sku) instead of throttling — a
  // partial batch delay is what was tipping this over the time limit before.
  const variationLists = await Promise.all(variableProducts.map(async (p) => {
    try {
      const resp = await getJson(`${baseUrl}/wp-json/wc/v3/products/${p.id}/variations?per_page=100`);
      return resp.json();
    } catch (e) {
      return [];
    }
  }));
  variationLists.forEach(variations => {
    variations.forEach(v => { if (v.sku) skus.push(v.sku); });
  });

  return Array.from(new Set(skus)).sort();
}

function parseSheetData(values) {
  if (!values || values.length < 2) return [];

  const headers = values[0].map(h => h.toLowerCase().trim());
  const orders = [];

  const dateIdx = headers.findIndex(h => h.includes('delivery date'));
  // Root cause of the missing-name bug: this sheet's actual header for the
  // customer's own name is a bare "name" (confirmed from a screenshot of
  // row 1), not "last name". The old strict "last name" check didn't just
  // miss that — it was matching the WRONG column ("deliver to last name",
  // this sheet's real header for who to hand the order to), because that
  // phrase also contains "last name" and — since it says "deliver", not
  // "delivered" — slipped past the old "!includes('delivered')" guard.
  // Try exact "name" first (this sheet), then "last name" done properly,
  // then a loose name-ish fallback as a last resort — always steering
  // clear of anything about delivery or line items.
  let nameIdx = headers.findIndex(h => h === 'name');
  if (nameIdx === -1) {
    nameIdx = headers.findIndex(h => h.includes('last name') && !h.includes('deliver'));
  }
  if (nameIdx === -1) {
    nameIdx = headers.findIndex(h => h.includes('name') && !h.includes('deliver') && !h.includes('item'));
  }
  const itemIdx = headers.findIndex(h => h.includes('line item'));
  const qtyIdx = headers.findIndex(h => h.includes('quantity') && !h.includes('individual'));
  const qtyIndividualIdx = headers.findIndex(h => h.includes('individual'));
  // Same "deliver" vs "delivered" mismatch applies here — this sheet's
  // header is "deliver to last name", not "delivered to ...".
  const deliveredToIdx = headers.findIndex(h => h.includes('deliver to') || h.includes('delivered to'));
  const addressIdx = headers.findIndex(h => h.includes('delivery address'));
  const pickupIdx = headers.findIndex(h => h.includes('pickup'));
  const noteIdx = headers.findIndex(h => h.includes('customer note'));
  const orderNumIdx = headers.findIndex(h => h.includes('order number'));
  const paymentIdx = headers.findIndex(h => h.includes('payment'));
  const totalIdx = headers.findIndex(h => h.includes('total'));
  // These two are new columns — blank/-1 until added to the sheet's header
  // row (see /api/update-order), which is fine: editing an older order just
  // won't have a cost breakdown to pre-fill, only whatever Total it has.
  const productCostIdx = headers.findIndex(h => h.includes('product cost'));
  const deliveryCostIdx = headers.findIndex(h => h.includes('delivery cost'));

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
      orderNumber: (row[orderNumIdx] || '').trim(),
      lastName: (row[nameIdx] || 'Unknown').trim(),
      deliveredTo: (row[deliveredToIdx] || '').trim(),
      items: items,
      address: (row[addressIdx] || '').trim(),
      pickupOrDelivery: (row[pickupIdx] || 'delivery').trim(),
      customerNote: (row[noteIdx] || '').trim(),
      paymentMethod: (row[paymentIdx] || '').trim(),
      total: (row[totalIdx] || '').trim(),
      productCost: (row[productCostIdx] || '').trim(),
      deliveryCost: (row[deliveryCostIdx] || '').trim()
    });
  }

  return orders.filter(o => o.deliveryDate && o.items.length > 0);
}

// Shared between /api/add-order and /api/update-order: validates the order
// fields and builds the flat row array matching the sheet's column order.
// Column order must match the live sheet exactly:
// A=Delivery Date, B=Order Number, C=Name, D=Line Item Name, E=Quantity,
// F=Quantity of Individual, G=Deliver To Last Name, H=Pickup/Delivery,
// I=Delivery Address, J=Total, K=Payment Method, L=Customer Note,
// M=Product Cost, N=Delivery Cost. M/N are new — add those two header
// labels to the sheet yourself if you want to see them there; this always
// writes into those columns either way.
function validateAndBuildOrderRow(body, orderNumber) {
  const {
    deliveryDate, lastName, deliveryName, pickupOrDelivery,
    deliveryAddress, customerNote, paymentMethod, total,
    productCost, deliveryCost, items
  } = body;

  if (!deliveryDate || !lastName || !String(lastName).trim()) {
    return { error: 'Delivery date and last name are required' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'At least one item is required' };
  }

  const productNames = items.map(i => String((i && i.product) || '').trim()).filter(Boolean);
  const quantities = items.map(i => {
    const q = parseInt(i && i.quantity, 10);
    return isNaN(q) ? 1 : q;
  });

  if (productNames.length === 0) {
    return { error: 'At least one item with a product is required' };
  }

  const row = [
    deliveryDate,
    orderNumber,
    String(lastName).trim(),
    productNames.join(', '),
    quantities.join(', '),
    '', // Quantity of Individual — left blank; the product's SKU already encodes pack size
    (deliveryName || '').trim(),
    pickupOrDelivery || 'delivery',
    (deliveryAddress || '').trim(),
    (total || '').toString().trim(),
    (paymentMethod || '').trim(),
    (customerNote || '').trim(),
    (productCost || '').toString().trim(),
    (deliveryCost || '').toString().trim()
  ];

  return { row };
}

function createJWT(serviceAccount) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file',
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

  // Hands the Google Maps API key to the page at request time instead of it
  // being hardcoded in index.html — keeps it out of the committed source
  // (and out of GitHub's secret scanner) while still being usable client-side,
  // which the Maps JavaScript API requires regardless. Restrict the key by
  // HTTP referrer in Google Cloud Console so it can't be used from elsewhere.
  if (req.method === 'GET' && req.url === '/api/maps-key') {
    res.status(200).json({ key: process.env.GOOGLE_MAPS_API_KEY || '' });
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

  if (req.method === 'POST' && req.url === '/api/add-order') {
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

      // Manual entries get their own order number prefix so they're distinguishable
      // from the sequential numbers WooCommerce/Zapier assigns.
      const orderNumber = 'M' + Date.now().toString().slice(-7);

      const built = validateAndBuildOrderRow(req.body, orderNumber);
      if (built.error) {
        res.status(400).json({ error: built.error });
        return;
      }

      const accessToken = await getAccessToken(serviceAccount);

      const sheetId = '1hW5nnsCyPVxNBXGV1CywgBaE1f9wMQxZEWk-rHu71hM';
      const range = 'Sheet1!A:N';

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [built.row] })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Google Sheets error: ${response.status} ${errBody}`);
      }

      res.status(200).json({ success: true, orderNumber });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/api/update-order') {
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

      const orderNumber = (req.body.orderNumber || '').toString().trim();
      if (!orderNumber) {
        res.status(400).json({ error: 'Missing order number — this order can\'t be matched back to its row in the sheet' });
        return;
      }

      const built = validateAndBuildOrderRow(req.body, orderNumber);
      if (built.error) {
        res.status(400).json({ error: built.error });
        return;
      }

      const accessToken = await getAccessToken(serviceAccount);
      const sheetId = '1hW5nnsCyPVxNBXGV1CywgBaE1f9wMQxZEWk-rHu71hM';

      // Re-read the sheet fresh and locate the row by order number, rather
      // than trusting a row number the client loaded earlier — someone
      // could have added or removed a row in the sheet in the meantime,
      // and this way an edit can never land on the wrong row.
      const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('Sheet1!A:N')}`;
      const readResp = await fetch(readUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!readResp.ok) {
        const errBody = await readResp.text();
        throw new Error(`Google Sheets error: ${readResp.status} ${errBody}`);
      }
      const readData = await readResp.json();
      const values = readData.values || [];
      const headers = (values[0] || []).map(h => h.toLowerCase().trim());
      const orderNumIdx = headers.findIndex(h => h.includes('order number'));
      if (orderNumIdx === -1) {
        throw new Error('Could not find the Order Number column in the sheet');
      }

      let rowNumber = -1;
      for (let i = 1; i < values.length; i++) {
        if ((values[i][orderNumIdx] || '').toString().trim() === orderNumber) {
          rowNumber = i + 1; // sheet rows are 1-indexed; values[0] is row 1
          break;
        }
      }
      if (rowNumber === -1) {
        res.status(404).json({ error: 'Order not found in the sheet — it may have been changed or removed since this page loaded. Refresh and try again.' });
        return;
      }

      const updateRange = `Sheet1!A${rowNumber}:N${rowNumber}`;
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED`;
      const updateResp = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [built.row] })
      });

      if (!updateResp.ok) {
        const errBody = await updateResp.text();
        throw new Error(`Google Sheets error: ${updateResp.status} ${errBody}`);
      }

      res.status(200).json({ success: true, orderNumber });
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

  if (req.method === 'GET' && req.url.startsWith('/api/products')) {
    // Serves the known-good SKU list captured after the Aug 30, 2026 SKU
    // project, baked directly into the code — instant, and immune to
    // whatever was causing basketsbyblimi.com's variations endpoint to hang
    // under load. Update KNOWN_PRODUCT_SKUS above whenever products change.
    //
    // Add ?live=1 to instead try pulling fresh straight from WooCommerce
    // (slower, and was timing out on this host as of Aug 30, 2026 — kept
    // here in case that improves later, but not used by default).
    if (req.url.includes('live=1')) {
      try {
        const wcKey = process.env.WC_CONSUMER_KEY;
        const wcSecret = process.env.WC_CONSUMER_SECRET;
        const wcUrl = process.env.WC_STORE_URL || 'https://basketsbyblimi.com';
        if (!wcKey || !wcSecret) {
          res.status(400).json({ error: 'WooCommerce API credentials not configured' });
          return;
        }
        const skus = await fetchAllWooCommerceSkus(wcUrl, wcKey, wcSecret);
        productsCache = { skus, fetchedAt: Date.now() };
        res.status(200).json({ products: skus, source: 'live' });
      } catch (error) {
        res.status(200).json({ products: KNOWN_PRODUCT_SKUS, source: 'static-fallback', liveError: error.message });
      }
      return;
    }

    res.status(200).json({ products: KNOWN_PRODUCT_SKUS, source: 'static' });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/product-prices')) {
    // Best-effort sku -> price map for Add Order's Product Cost auto-fill.
    // Split into two steps because firing one variations call per variable
    // product all at once (the old single-shot approach) is exactly what's
    // timed out on this store's API before:
    //   - no query params: fast pass over the top-level products list only,
    //     returns simple-product prices plus the variable-product ids that
    //     still need their variations fetched.
    //   - ?variationIds=1,2,3: fetches just that small batch's variations.
    //     The client (index.html) requests these in small batches so a slow
    //     response from the store can never blow the whole feature's timeout.
    const wcKey = process.env.WC_CONSUMER_KEY;
    const wcSecret = process.env.WC_CONSUMER_SECRET;
    const wcUrl = process.env.WC_STORE_URL || 'https://basketsbyblimi.com';
    if (!wcKey || !wcSecret) {
      res.status(200).json({ prices: {}, variableProductIds: [], source: 'unavailable', error: 'WooCommerce API credentials not configured' });
      return;
    }

    const variationIdsMatch = req.url.match(/[?&]variationIds=([^&]+)/);
    if (variationIdsMatch) {
      const ids = decodeURIComponent(variationIdsMatch[1]).split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
      const now = Date.now();
      const prices = {};
      const idsToFetch = [];
      ids.forEach(id => {
        const cached = variationPriceCache[id];
        if (cached && (now - cached.fetchedAt) < VARIATION_CACHE_TTL_MS) {
          Object.assign(prices, cached.prices);
        } else {
          idsToFetch.push(id);
        }
      });
      if (idsToFetch.length === 0) {
        res.status(200).json({ prices, source: 'cache' });
        return;
      }
      try {
        const fetched = await fetchWooCommerceVariationPrices(wcUrl, wcKey, wcSecret, idsToFetch);
        idsToFetch.forEach(id => { variationPriceCache[id] = { prices: fetched, fetchedAt: now }; });
        Object.assign(prices, fetched);
        res.status(200).json({ prices, source: 'live' });
      } catch (error) {
        // Whatever we already had cached for this batch still gets served —
        // just the freshly-requested ids come back empty this round.
        res.status(200).json({ prices, source: 'partial', error: error.message });
      }
      return;
    }

    if (priceCache && (Date.now() - priceCache.fetchedAt) < PRICE_CACHE_TTL_MS) {
      res.status(200).json({ prices: priceCache.prices, variableProductIds: priceCache.variableProductIds, source: 'cache' });
      return;
    }
    try {
      const { prices, variableProductIds } = await fetchSimpleWooCommercePrices(wcUrl, wcKey, wcSecret);
      priceCache = { prices, variableProductIds, fetchedAt: Date.now() };
      res.status(200).json({ prices, variableProductIds, source: 'live' });
    } catch (error) {
      if (priceCache) {
        res.status(200).json({ prices: priceCache.prices, variableProductIds: priceCache.variableProductIds, source: 'stale-fallback', liveError: error.message });
      } else {
        res.status(200).json({ prices: {}, variableProductIds: [], source: 'unavailable', error: error.message });
      }
    }
    return;
  }

  if (req.url === '/api/health') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
