const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    PROFILE: (id: string) => `/profile/${id}`,
    TAGS: (id: string) => `/tags/${id}`,
    ASK_QUESTION: "/ask-question",
    QUESTIONS: (id: string) => `/question/${id}`,
}

export default ROUTES