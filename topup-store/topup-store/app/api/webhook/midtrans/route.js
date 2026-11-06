import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { topup } from '@/lib/digiflazz';

export async function POST(req) {
  const b = await req.json();
  const sig = crypto.createHash('sha512')
    .update(b.order_id + b.status_code + b.gross_amount + process.env.MIDTRANS_SERVER_KEY).digest('hex');
  if (sig !== b.signature_key) return NextResponse.json({ error: 'bad signature' }, { status: 403 });

  if (['expire', 'cancel', 'deny'].includes(b.transaction_status)) {
    await db.from('orders').update({ status: 'FAILED' }).eq('invoice', b.order_id).eq('status', 'PENDING');
    return NextResponse.json({ ok: true });
  }
  if (!['settlement', 'capture'].includes(b.transaction_status)) return NextResponse.json({ ok: true });

  // Idempotent: hanya satu webhook yang berhasil mengubah PENDING -> PAID
  const { data: o } = await db.from('orders').update({ status: 'PAID' })
    .eq('invoice', b.order_id).eq('status', 'PENDING').select().single();
  if (!o || Number(b.gross_amount) !== o.total) return NextResponse.json({ ok: true });

  try {
    const r = await topup({ invoice: o.invoice, sku: o.sku, customerNo: o.user_game_id + o.server });
    const status = r?.status === 'Sukses' ? 'SUCCESS' : r?.status === 'Gagal' ? 'FAILED' : 'PAID';
    await db.from('orders').update({ status }).eq('invoice', o.invoice);
  } catch (e) { /* tetap PAID; cek manual atau tunggu callback */ }
  return NextResponse.json({ ok: true });
}
