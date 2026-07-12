import Event from "@/components/Event";
import { withProtectedPage } from "@/lib/withProtectedPage";

function Index() {
    return (
        <Event />
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index);
export default Page;
export { getServerSideProps };