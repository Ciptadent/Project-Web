import crypto from 'crypto';
export async function topup({ invoice, sku, customerNo }) {
  const u = process.env.DIGIFLAZZ_USERNAME, k = process.env.DIGIFLAZZ_API_KEY;
  const sign = crypto.createHash('md5').update(u + k + invoice).digest('hex');
  const r = await fetch('https://api.digiflazz.com/v1/transaction', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u, buyer_sku_code: sku, customer_no: customerNo, ref_id: invoice, sign }),
  });
  return (await r.json()).data; // data.status: Sukses | Pending | Gagal
}
