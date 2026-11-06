'use client';
import { useState } from 'react';
import { games } from '@/lib/products';
const rp = n => 'Rp' + n.toLocaleString('id-ID');

export default function Home() {
  const [g, setG] = useState(games[0]);
  const [sku, setSku] = useState('');
  const [f, setF] = useState({ userId: '', server: '', contact: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const item = g.items.find(i => i.sku === sku);

  async function pay() {
    setErr('');
    if (!item || !f.userId.trim() || (g.needServer && !f.server.trim())) return setErr('Pilih nominal dan isi ID game dengan lengkap.');
    setBusy(true);
    const r = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: g.id, sku, ...f }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error || 'Terjadi kesalahan.');
    location.href = d.url;
  }
  return (
    <main>
      <h1>Top up game, langsung masuk.</h1>
      <p className="sub">Bayar dengan QRIS, VA, atau e-wallet. Diamond dikirim otomatis setelah pembayaran.</p>
      <fieldset><legend>Pilih game</legend><div className="grid">
        {games.map(x => <button key={x.id} className="opt" aria-pressed={x.id === g.id}
          onClick={() => { setG(x); setSku(''); }}><b>{x.name}</b></button>)}
      </div></fieldset>
      <fieldset><legend>Pilih nominal</legend><div className="grid">
        {g.items.map(i => <button key={i.sku} className="opt" aria-pressed={i.sku === sku} onClick={() => setSku(i.sku)}>
          <b>{i.label}</b><span>{rp(i.price)}</span></button>)}
      </div></fieldset>
      <fieldset><legend>Data akun</legend>
        <input placeholder="User ID" value={f.userId} onChange={e => setF({ ...f, userId: e.target.value })} />
        {g.needServer && <input placeholder="Server / Zone ID" value={f.server} onChange={e => setF({ ...f, server: e.target.value })} />}
        <input placeholder="WhatsApp atau email (untuk bukti pesanan)" value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} />
      </fieldset>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="buy" disabled={busy} onClick={pay}>{busy ? 'Memproses…' : item ? `Bayar ${rp(item.price)}` : 'Bayar'}</button>
    </main>
  );
}
