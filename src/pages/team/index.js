import Team from "@/components/Team/Index";
import { withProtectedPage } from "@/lib/withProtectedPage";

function Index() {
    return (
        <Team />
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index);
export default Page;
export { getServerSideProps };