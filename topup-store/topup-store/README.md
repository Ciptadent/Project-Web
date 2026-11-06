# Topup Store (Next.js + Vercel)
1. Jalankan `supabase.sql` di Supabase (SQL Editor).
2. Salin `.env.example` ke `.env.local`, isi semua nilai. `npm install && npm run dev`.
3. Ganti `sku` & harga di `lib/products.js` dengan kode asli Digiflazz.
4. Push ke GitHub, import ke Vercel, isi Environment Variables yang sama.
5. Midtrans: Payment Notification URL = https://DOMAIN/api/webhook/midtrans
   Digiflazz: Webhook URL = https://DOMAIN/api/webhook/digiflazz (isi secret yang sama dengan .env)
6. Uji penuh di sandbox sebelum memakai kunci production.
