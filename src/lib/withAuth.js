import { getAuthUser } from './auth';

export function withAuth(allowedRoles) {
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

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return {
                redirect: {
                    destination: '/403',
                    permanent: false,
                },
            };
        }

        return { props: { user } };
    };
}