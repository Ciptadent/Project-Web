import './globals.css';
import { Bricolage_Grotesque } from 'next/font/google';
const f = Bricolage_Grotesque({ subsets: ['latin'] });
export const metadata = { title: 'Top Up Game Cepat', description: 'Top up diamond, bayar QRIS, masuk otomatis.' };
export default function RootLayout({ children }) {
  return <html lang="id"><body className={f.className}>{children}</body></html>;
}
