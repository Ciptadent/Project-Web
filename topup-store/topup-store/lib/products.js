// Ganti sku dengan buyer_sku_code asli dari Digiflazz, dan sesuaikan harga jual.
export const games = [
  { id: 'ml', name: 'Mobile Legends', needServer: true, items: [
    { sku: 'ml86', label: '86 Diamond', price: 21000 },
    { sku: 'ml172', label: '172 Diamond', price: 42000 } ] },
  { id: 'ff', name: 'Free Fire', needServer: false, items: [
    { sku: 'ff70', label: '70 Diamond', price: 10500 },
    { sku: 'ff140', label: '140 Diamond', price: 21000 } ] },
];
export const findItem = (g, sku) => games.find(x => x.id === g)?.items.find(i => i.sku === sku);
