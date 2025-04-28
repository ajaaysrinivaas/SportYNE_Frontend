export class ConfigStore {
    BACKEND_URL: string;
    TOPICS_ENDPOINT: string = process.env.NEXT_PUBLIC_TOPICS_ENDPOINT ? process.env.NEXT_PUBLIC_TOPICS_ENDPOINT : 
                (() => { throw new Error("TOPICS_ENDPOINT is not set in .env file!"); })();

    POST_CONTENT_ENDPOINT : string = process.env.NEXT_PUBLIC_POST_CONTENT_ENDPOINT ? process.env.NEXT_PUBLIC_POST_CONTENT_ENDPOINT : 
                (() => { throw new Error("POST_CONTENT_ENDPOINT is not set in .env file!"); })();

    FOOD_SEARCH_ENDPOINT : string = process.env.NEXT_PUBLIC_FOOD_SEARCH_ENDPOINT ? process.env.NEXT_PUBLIC_FOOD_SEARCH_ENDPOINT :
                (() => { throw new Error("FOOD_SEARCH_ENDPOINT is not set in .env file!"); })();

    constructor() {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!url) {
            throw new Error("BACKEND_URL is not set in .env file!");
        }
        this.BACKEND_URL = url;
    }
}