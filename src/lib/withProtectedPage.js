import Layout from '@/components/Common/Layout';
import { withAuth } from './withAuth';

export function withProtectedPage(Page) {
    Page.getLayout = (page) => <Layout>{page}</Layout>;
    return {
        Page,
        getServerSideProps: withAuth(),
    };
}