import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
    title: "No Data Found",
    message: "Looks like we couldn't find any data for you. Wake it up with some new entries.",
    button: {
        text: "Create New",
        href: ROUTES.HOME
    }
}

export const DEFAULT_ERROR = {
    title: "Oops! Something went wrong.",
    message: "Even out code have a bad day sometimes. Give it another try.",
    button: {
        text: "Try Again",
        href: ROUTES.HOME
    }
}

export const EMPTY_QUESTIONS = {
    title: "Ahh, No Questions Found",
    message: "The questions you are looking for are not available. Try searching for something else.",
    button: {
        text: "Ask a Question",
        href: ROUTES.ASK_QUESTION
    }
}

export const EMPTY_TAGS = {
    title: "No Tags Found",
    message: "Looks like we couldn't find any tags for you. Wake it up with some new entries.",
    button: {
        text: "Create New Tag",
        href: ROUTES.TAGS
    }
}

export const EMPTY_COLLECTIONS = {
    title: "No Collections Found",
    message: "Looks like we couldn't find any collections for you. Wake it up with some new entries.",
    button: {
        text: "Create New Collection",
        href: ROUTES.COLLECTION
    }
}

export const EMPTY_ANSWERS = {
    title: "No Answer Found",
    message: "The answer board is empty. Make it rain with your brilliant answer",
    // button: {
    //     text: "Answer Question",
    //     href: ROUTES.HOME
    // }
}

export const EMPTY_USERS = {
    title: "No User Found",
    message: "You're alone. More users coming soon!",
    button: {
        text: "Create New Tag",
        href: ROUTES.TAGS
    }
}