import Axios, { AxiosError } from "axios";
import { baseApiUrl } from '../core/const';

export const upcomingReleaseInfoUrl = `${baseApiUrl}/latest/releaseInfo`;
export const latestApprovedReleasesInfoUrl = `${baseApiUrl}/latest/week`;
export const latestReleasesInfoUrl = `${baseApiUrl}/latest/info`;

export const getInfo = (url: string): Promise<any> => {
    const promise = new Promise((resolve, reject) => {
        Axios.get(url)
            .then((response) => resolve(response.data))
            .catch((error: AxiosError) => {
                reject(error);
                alert(getMessageError(error));
            })
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
