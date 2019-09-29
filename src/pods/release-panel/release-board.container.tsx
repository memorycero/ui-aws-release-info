import * as React from "react";
import { ReleaseBoardComponent } from "./release-board.component";
import { BuildInfo } from "./release.vm";
import {getInfo, upcomingReleaseInfoUrl, latestApprovedReleasesInfoUrl, latestReleasesInfoUrl} from '../../api/amazonaws.api'
import { convertFromApiToUpcomingReleases, convertFromApiToLatestApproved } from "./release-board.converter";

const createDefaultBuilds = (): BuildInfo[] => {
    return [{
        rt: "LL-3669",
        branch: "LL-3669-RC",
        status: "SUCCESS",
        step: "Integration Tests",
        team: "Morpheus",
        id: 1569330135468,
        build: "499152"
    }, {
        rt: "LL-3669",
        branch: "LL-3669-RC",
        status: "SUCCESS",
        step: "Live Deploy",
        team: "Blinky",
        id: 1569332892983,
        build: "499203"
    }, {
        rt: "LL-3669",
        branch: "atoms",
        status: "SUCCESS",
        step: "Start Release",
        team: "Hydra",
        id: 1569326561929,
        build: "499131"
    }];
}

export const HotelEditionContainer = () => {
    const [inPreparation, setInPreparation] = React.useState([]);
    const [testingOnTestServer, setTestingOnTestServer] = React.useState([]);
    const [deployingLive, setDeployingLive] = React.useState([]);
    const [approved, setApproved] = React.useState([]);

    const loadReleaseInfo = () => {
        getInfo(upcomingReleaseInfoUrl).then(result => {
            let upComingReleases:BuildInfo[] = convertFromApiToUpcomingReleases(result);
            upComingReleases.map(elem => {
                getInfo(`${latestReleasesInfoUrl}/${elem.rt}`).then(result => {
                    if(result.step === 'Deploy Testsystem'){
                        setTestingOnTestServer([result]);
                    }
                });
            })
        });
        getInfo(upcomingReleaseInfoUrl).then(result => {
            let upComingReleases:BuildInfo[] = convertFromApiToUpcomingReleases(result);
            let pending:BuildInfo[] = [];
            upComingReleases.map(elem => {
                getInfo(`${latestReleasesInfoUrl}/${elem.rt}`).then(result => {
                    if(result.step !== 'Deploy Testsystem'){
                        pending.push(result);
                    }
                });
            })
            setInPreparation(pending);
        });
        getInfo(upcomingReleaseInfoUrl).then(result => {
            let upComingReleases:BuildInfo[] = convertFromApiToUpcomingReleases(result);
            let pending:BuildInfo[] = [];
            upComingReleases.map(elem => {
                getInfo(`${latestReleasesInfoUrl}/${elem.rt}`).then(result => {
                    if(result.step === 'Live Deploy'){
                        pending.push(result);
                    }
                });
            })
            setDeployingLive(pending);
        });
        getInfo(latestApprovedReleasesInfoUrl).then(result => {
            setApproved(convertFromApiToLatestApproved(result));
        });
    }

    React.useEffect(() => {
        loadReleaseInfo();
    }, [])

    return (
        <>
            <ReleaseBoardComponent inPreparation={inPreparation} testingOnTestServer={testingOnTestServer}
                deployingLive={deployingLive} approved={approved}
            />
        </>
    )
}
