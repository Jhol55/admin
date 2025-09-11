import { api } from "./api";

export interface ProfileResponse {
    id: string;
    picture: string;
    name: string;
}

export const profileApi = {
    getProfile: (sessionName: string) => {
        return api.get<ProfileResponse>(`/${sessionName}/profile`);
    }
};