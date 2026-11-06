import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req) {
  const raw = await req.text();
  const sig = 'sha1=' + crypto.createHmac('sha1', process.env.DIGIFLAZZ_WEBHOOK_SECRET).update(raw).digest('hex');
  if (sig !== req.headers.get('x-hub-signature')) return NextResponse.json({ error: 'bad signature' }, { status: 403 });
  const d = JSON.parse(raw).data;
  const status = d.status === 'Sukses' ? 'SUCCESS' : d.status === 'Gagal' ? 'FAILED' : null;
  if (status) await db.from('orders').update({ status }).eq('invoice', d.ref_id);
  return NextResponse.json({ ok: true });
}
