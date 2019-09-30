import { BuildInfo } from "./release.vm";
import { orderBy } from 'lodash';

export const convertFromApiToUpcomingReleases = (json): BuildInfo[] => {
    let releases = [];
    if (json !== undefined && json.upcoming !== undefined
        && json.upcoming.length > 0) {
        json.upcoming.map(elem => {
            releases.push({
                rt: elem.rt,
                team: elem.team
            })
        });
        orderBy(releases, ['rt'], ['asc']);
        return releases;
    }
    return releases;
};

export const convertFromApiToDeploying = (json): BuildInfo => {
    let realeaseDeploying;
    if (json.status === 'Live Deploy') {
        realeaseDeploying = {
            rt: json.rt,
            team: json.team
        }
    }
    return realeaseDeploying;
};

export const convertFromApiToLatestApproved = (json): BuildInfo[] => {
    let approvedReleases = [];
    orderBy(json.Items, ['id'], ['desc']).map(elem => {
        if (elem.step === 'Approve' && elem.status === 'SUCCESS') {
            approvedReleases.push({
                rt: elem.rt,
                team: elem.team,
                branch: elem.branch,
                status: elem.status,
                step: elem.step,
                id: elem.id,
                build: elem.build
            })
        }
    })
    return approvedReleases;
};