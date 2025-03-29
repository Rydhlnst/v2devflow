const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    PROFILE: (id: string) => `/user/${id}`,
    TAGS: (id: string) => `/tags/${id}`,
    ASK_QUESTION: "/ask-question",
    QUESTIONS: (id: string) => `/question/${id}`,
    SIGN_IN_WITH_OAUTH: `signin-with-oauth`
}

export default ROUTES