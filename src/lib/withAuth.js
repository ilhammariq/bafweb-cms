import { getAuthUser } from './auth';


export function  withAuth() {
    return async (context) => {
        const user = getAuthUser(context.req);

        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        return { props: {} };
    };
}