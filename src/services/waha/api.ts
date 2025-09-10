import { Api } from "../api";


// Para uso no servidor (API routes)
export const api = new Api({
    baseURL: 'https://3fit-waha-plus-gows.awmygg.easypanel.host/api',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.WAHA_API_KEY as string,
    },
});