import AddMember from '@/components/Member/AddMember';
import { withProtectedPage } from '@/lib/withProtectedPage';

function Index() {
    return (
        <div className='p-10 rounded-lg shadow-lg bg-white'>
            <h1 className="text-2xl font-bold">Tambah Member</h1>
            <AddMember />
        </div>
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index);
export default Page;
export { getServerSideProps };