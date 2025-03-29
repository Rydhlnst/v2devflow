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

export interface AuthCredentials {
    name: string,
    username: string;
    email: string;
    password: string;
}