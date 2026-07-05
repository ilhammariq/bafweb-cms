import AddTeam from "@/components/Team/AddTeam";

export default function Index() {
    return (
        <div className='p-10 rounded-lg shadow-lg bg-white'>
            <h1 className="text-2xl font-bold">Tambah Team</h1>
            <AddTeam />
        </div>
    )
}