import AddMember from '@/components/Member/AddMember';

export default function Index() {
    return (
        <div className='p-10 rounded-lg shadow-lg bg-white'>
            <h1 className="text-2xl font-bold">Tambah Member</h1>
            <AddMember />
        </div>
    )
}