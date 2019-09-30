import * as React from "react";
import { ReleaseBoardComponent } from "./release-board.component";
import { BuildInfo } from "./release.vm";
import { getInfo, upcomingReleaseInfoUrl, latestApprovedReleasesInfoUrl, latestReleasesInfoUrl } from '../../api/amazonaws.api'
import { convertFromApiToUpcomingReleases, convertFromApiToLatestApproved, convertFromApiToDeploying } from "./release-board.converter";
import { trackPromise } from "react-promise-tracker";
import { LoadingSpinerComponent } from "components/spinner";

export const HotelEditionContainer = () => {
    const [inPreparation, setInPreparation] = React.useState([]);
    const [testingOnTestServer, setTestingOnTestServer] = React.useState([]);
    const [deployingLive, setDeployingLive] = React.useState([]);
    const [approved, setApproved] = React.useState([]);

    const loadReleaseInfo = () => {
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {
            let upComingReleases: BuildInfo[] = convertFromApiToUpcomingReleases(result);
            upComingReleases.map(elem => {
                trackPromise(getInfo(`${latestReleasesInfoUrl}/${elem.rt}`).then(result => {
                    if (result.step === 'Deploy Testsystem') {
                        setTestingOnTestServer([result]);
                    }
                }));
            });
        }));
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {
            let upComingReleases: BuildInfo[] = convertFromApiToUpcomingReleases(result);
            let pending: BuildInfo[] = [];
            upComingReleases.map(elem => {
                trackPromise(getInfo(`${latestReleasesInfoUrl}/${elem.rt}`).then(result => {
                    if (result.step !== 'Deploy Testsystem') {
                        pending.push(result);
                    }
                }));
            });
            setInPreparation(pending);
        }));
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {
            let deployingLiveBuild: BuildInfo = convertFromApiToDeploying(result);
            let deployingLiveList: BuildInfo[] = [];
            if (deployingLiveBuild !== undefined) {
                deployingLiveList.push(deployingLiveBuild);
            }
            setDeployingLive(deployingLiveList);
        }));
        trackPromise(getInfo(latestApprovedReleasesInfoUrl).then(result => {
            setApproved(convertFromApiToLatestApproved(result));
        }));
    }

    React.useEffect(() => {
        loadReleaseInfo();
    }, [])

    return (
        <>
            <LoadingSpinerComponent>
                <ReleaseBoardComponent inPreparation={inPreparation} testingOnTestServer={testingOnTestServer}
                    deployingLive={deployingLive} approved={approved}
                />
            </LoadingSpinerComponent>
        </>
    )
}
