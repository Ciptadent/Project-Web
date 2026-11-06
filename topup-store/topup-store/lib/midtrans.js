const base = () => process.env.MIDTRANS_IS_PRODUCTION === 'true'
  ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';
export async function createSnap(orderId, amount, name) {
  const auth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64');
  const r = await fetch(base() + '/snap/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + auth },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: orderId, price: amount, quantity: 1, name: name.slice(0, 50) }],
    }),
  });
  if (!r.ok) throw new Error('Midtrans: ' + (await r.text()));
  return r.json(); // { token, redirect_url }
}
