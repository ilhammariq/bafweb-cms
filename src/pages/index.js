export default function Dashboard() {
  const cards = [
    {
      title: 'Total Pendapatan',
      value: '$45,231.89',
      color: 'bg-green-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: 'Pengguna Baru',
      value: '+2,350',
      color: 'bg-blue-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    {
      title: 'Total Penjualan',
      value: '+12,234',
      color: 'bg-purple-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
  ];

  // Data persentase tinggi untuk grafik batang native CSS
  const dataGrafik = [
    { name: 'Jan', persentase: 60, nilai: '40k' },
    { name: 'Feb', persentase: 45, nilai: '30k' },
    { name: 'Mar', persentase: 85, nilai: '50k' },
    { name: 'Apr', persentase: 40, nilai: '27k' },
    { name: 'Mei', persentase: 30, nilai: '18k' },
    { name: 'Jun', persentase: 55, nilai: '23k' },
  ];

  return (
    <div className="space-y-6">
      Hallo
    </div>
  );
}
