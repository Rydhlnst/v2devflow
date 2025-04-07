const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    COLLECTION: "/collection",
    TAGS: "/tags",
    PROFILE: (id: string) => `/user/${id}`,
    TAG: (id: string) => `/tags/${id}`,
    ASK_QUESTION: "/ask-question",
    QUESTIONS: (id: string) => `/questions/${id}`,
    SIGN_IN_WITH_OAUTH: `signin-with-oauth`
}

export default ROUTES