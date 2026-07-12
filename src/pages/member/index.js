import Member from '@/components/Member';
import { withProtectedPage } from '@/lib/withProtectedPage';

function Index() {
    return (
        <Member />
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index);
export default Page;
export { getServerSideProps };