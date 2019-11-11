import * as React from "react";
import { ReleaseBoardComponent } from "./release-board.component";
import { BuildInfoVm, ReleaseSteps, BoardReleaseInfo, ReleaseHeader } from "./release.vm";
import { getInfo, lastWeekReleasesInfoUrl, upcomingReleaseInfoUrl, releaseInfoUrl } from '../../api/amazonaws.api'
import { mapBuildsFromApiToVm, mapBuildFromApiToVm } from "./release-board.mapper";
import { trackPromise } from "react-promise-tracker";
import { LoadingSpinerComponent } from "components/spinner";
import { orderBy, reverse } from "lodash";
import { SessionContext } from "core";

export const ReleaseBoardContainer = () => {
    const [releasesInPreparation, setReleasesInPreparation] = React.useState([]);
    const [releasesOnWww1, setReleasesOnWww1] = React.useState([]);
    const [releasesLive, setReleasesLive] = React.useState([]);
    const [releasesApproved, setReleasesApproved] = React.useState([]);

    const [isSubscribed, setIsSuscribed] = React.useState(true);

    const sessionContext = React.useContext(SessionContext);
    const [refreshTime] = React.useState(sessionContext.refreshTimeout);

    const initData = () => {
        setReleasesInPreparation([]);
        setReleasesOnWww1([]);
        setReleasesLive([]);
        setReleasesApproved([]);
    }

    const loadReleasesInfo = () => {
        initData();
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {
            let upcomingReleases: BuildInfoVm[] = mapBuildsFromApiToVm(result.upcoming);

            upcomingReleases.map(elem => {
                if (isSubscribed) {
                    trackPromise(getInfo(`${releaseInfoUrl}/${elem.rt}`).then(result => {
                        if (isSubscribed) {
                            let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                            let boardReleaseInfo: BoardReleaseInfo = createBoardReleaseInfo(releaseSteps);
                            if (boardReleaseInfo.releaseHeader.lastStep === ReleaseSteps.DeployTestSystem) {
                                setReleasesOnWww1(releasesOnWww1 => [...releasesOnWww1, boardReleaseInfo]);
                            } else if(boardReleaseInfo.releaseHeader.lastStep === ReleaseSteps.Live){
                                setReleasesLive(releasesLive => [...releasesLive, boardReleaseInfo]);
                            } else {
                                setReleasesInPreparation(releasesInPreparation => [...releasesInPreparation, boardReleaseInfo]);
                            }
                        }
                    }));
                }
            });

            let deployingLiveBuild: BuildInfoVm = mapBuildFromApiToVm(result);
            if (deployingLiveBuild !== undefined && deployingLiveBuild.status === 'Live Deploy') {
                if (isSubscribed) {
                    trackPromise(getInfo(`${releaseInfoUrl}/${deployingLiveBuild.rt}`).then(result => {
                        let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                        let boardReleaseInfo: BoardReleaseInfo = createBoardReleaseInfo(releaseSteps);
                        setReleasesLive(releasesLive => [...releasesLive, boardReleaseInfo]);
                    }
                    ));
                }
            }
        }
        ));

        if (isSubscribed) {
            trackPromise(getInfo(lastWeekReleasesInfoUrl).then(result => {
                let approvedReleases: BoardReleaseInfo[] = getOnlyApprovedReleases(mapBuildsFromApiToVm(result.Items));
                setReleasesApproved(approvedReleases);
            }
            ));
        }
    }

    React.useEffect(() => {
        loadReleasesInfo();
        let customInterval = setInterval(() => {
            loadReleasesInfo();
        }, refreshTime);
        return () => {
            //Cleanup
            setIsSuscribed(false);
            clearInterval(customInterval)
        };
    }, [refreshTime]);

    return (
        <>
            <LoadingSpinerComponent>
                <ReleaseBoardComponent
                    releasesInPreparation={releasesInPreparation}
                    releasesOnWww1={releasesOnWww1}
                    releasesLive={releasesLive}
                    releasesApproved={releasesApproved}
                />
            </LoadingSpinerComponent>
        </>
    )
}

const getOnlyApprovedReleases = (builds: BuildInfoVm[]): BoardReleaseInfo[] => {
    let result: BoardReleaseInfo[] = [];
    orderBy(builds, ['build'], ['desc']).filter(build => build.step === ReleaseSteps.Approve).map(build => {
        let releaseHeader: ReleaseHeader = {
            rt: build.rt,
            team: build.team,
            status: build.status,
            lastStep: build.step
        }
        result.push({
            releaseHeader
        })
    })
    return result;
}

const createBoardReleaseInfo = (builds: BuildInfoVm[]): BoardReleaseInfo => {
    let stepsMap = new Map<ReleaseSteps, BuildInfoVm>();

    orderBy(builds, ['build'], ['asc']).map(elem => {
        stepsMap.set(elem.step, elem);
    });

    let releaseSteps: BuildInfoVm[] = reverse(orderByReleaseSteps([...stepsMap.values()]));
    const lastStep = releaseSteps[0];

    let releaseHeader: ReleaseHeader = {
        rt: lastStep.rt,
        team: lastStep.team,
        status: getLastStepStatus(lastStep),
        lastStep: lastStep.step
    }

    return {
        releaseHeader,
        releaseSteps
    }
}

const getLastStepStatus = (lastStep: BuildInfoVm): string => {
    if (lastStep.step === ReleaseSteps.IntegrationLatestDump && lastStep.status === 'FAILURE') {
        return 'WARN';
    }
    return lastStep.status;
}

const orderByReleaseSteps = (builds: BuildInfoVm[], ): BuildInfoVm[] => {
    const order = [ReleaseSteps.StartRelease, ReleaseSteps.Build, ReleaseSteps.IntegrationLatestDump,
    ReleaseSteps.IntegrationTests, ReleaseSteps.DeployTestSystem, ReleaseSteps.Live,
    ReleaseSteps.Approve, ReleaseSteps.Cancel];

    return builds.sort((a, b) => order.indexOf(a.step) - order.indexOf(b.step));
}
