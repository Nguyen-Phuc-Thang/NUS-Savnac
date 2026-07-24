import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                console.log(process.env.NEXT_PUBLIC_API_URL);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    },
                );

                const user = await res.json();

                if (!res.ok) return null;

                return user;
            },
        }),
    ],

    session: {
        strategy: 'jwt' as const,
    },

    callbacks: {
        async jwt({
            token,
            user,
            trigger,
            session,
        }: {
            token: any;
            user: any;
            trigger?: string;
            session?: any;
        }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }

            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }

            return token;
        },

        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
            }

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
