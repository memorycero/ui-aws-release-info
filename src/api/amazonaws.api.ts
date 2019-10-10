import Axios, { AxiosError } from "axios";
import { baseApiUrl } from '../core/const';

export interface BuildInfoApi {
    rt: string,
    team: string,
    branch?: string,
    status?: string,
    step?: string,
    id?: number,
    build?: string
}

export const lastWeekReleasesInfoUrl = `${baseApiUrl}/latest/week`;
export const upcomingReleaseInfoUrl = `${baseApiUrl}/latest/releaseInfo`;
export const releaseInfoUrl = `${baseApiUrl}/latest/rt`;

export const getInfo = (url: string): Promise<any> => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            Axios.get(url)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    reject(error);
                    console.log(getMessageError(error));
                });
        }, 500);
    });
    return promise;
}

const getMessageError = (error: AxiosError): string => {
    if (error.response) {
        switch (error.response.status) {
            case 404: return 'Data not found';
            case 503: return 'Service unavailable';
        }
    }
    return 'Request cannot be processed';
}
