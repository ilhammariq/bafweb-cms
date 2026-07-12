import { withProtectedPage } from "@/lib/withProtectedPage";

function Index() {
    return (
        <div>Haloo</div>
    )
}

const { Page, getServerSideProps } = withProtectedPage(Index);
export default Page;
export { getServerSideProps };