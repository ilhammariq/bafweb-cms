export default function InputCuti() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Input Cuti Karyawan</h2>
            <p className="text-sm text-gray-500 mb-6">Pencatatan pengajuan cuti resmi karyawan agar tidak masuk jadwal WFO.</p>

            {/* Contoh Tampilan Elemen Form Sederhana */}
            <div className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Karyawan</label>
                    <select className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
                        <option>Ahmad Fauzi</option>
                        <option>Siti Rahma</option>
                        <option>Budi Santoso</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Cuti</label>
                    <textarea className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" rows="3" placeholder="Alasan keperluan cuti..."></textarea>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Ajukan Cuti
                </button>
            </div>
        </div>
    );
}
