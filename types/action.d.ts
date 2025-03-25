export interface SignInWithOAuthParams {
    provider: 'github' | "google",
    providerAccountId: string,
    user: {
        name: string,
        email: string,
        image: string,
        username: string,
    }
} 