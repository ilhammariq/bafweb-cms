import { useState } from 'react';

export default function InputUsers() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'Viewer',
        division: 'Engineering',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setFormData({ fullName: '', email: '', role: 'Viewer', division: 'Engineering' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Input Data Team</h2>
                <p className="text-sm text-gray-500 mt-1">Tambahkan anggota tim baru ke dalam sistem manajemen.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Contoh: johndoe@company.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Akses</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Divisi Kerja</label>
                        <select
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-5 rounded-md transition-colors"
                    >
                        Simpan Anggota Tim
                    </button>
                </div>
            </form>
        </div>
    );
}
