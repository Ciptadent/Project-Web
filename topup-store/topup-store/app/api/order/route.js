import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findItem } from '@/lib/products';
import { createSnap } from '@/lib/midtrans';

export async function POST(req) {
  const { game, sku, userId, server, contact } = await req.json();
  const item = findItem(game, sku); // harga SELALU dari server
  if (!item || !userId?.trim()) return NextResponse.json({ error: 'Data pesanan belum lengkap.' }, { status: 400 });
  const invoice = 'INV' + Date.now() + Math.floor(100 + Math.random() * 900);
  const { error } = await db.from('orders').insert({
    invoice, game, sku, item_label: item.label, user_game_id: userId.trim(),
    server: server?.trim() || '', contact: contact?.trim() || '', total: item.price, status: 'PENDING' });
  if (error) return NextResponse.json({ error: 'Gagal menyimpan pesanan.' }, { status: 500 });
  try {
    const snap = await createSnap(invoice, item.price, item.label);
    return NextResponse.json({ invoice, url: snap.redirect_url });
  } catch (e) {
    return NextResponse.json({ error: 'Gagal membuat pembayaran.' }, { status: 502 });
  }
}
