import AddTeam from "@/components/Team/AddTeam";
import { withProtectedPage } from "@/lib/withProtectedPage";

function Index() {
    return (
        <div className='p-10 rounded-lg shadow-lg bg-white'>
            <h1 className="text-2xl font-bold">Tambah Team</h1>
            <AddTeam />
        </div>
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index, ['ADMIN']);
export default Page;
export { getServerSideProps };