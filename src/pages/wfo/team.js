export default function InputTeam() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Input List Team WFO</h2>
            <p className="text-sm text-gray-500 mb-6">Formulir untuk memasukkan jadwal kerja Work From Office tim Anda.</p>

            {/* Contoh Tampilan Elemen Form Sederhana */}
            <div className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tim / Karyawan</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Masukkan nama..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal WFO</label>
                    <input type="date" className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Simpan Jadwal
                </button>
            </div>
        </div>
    );
}
