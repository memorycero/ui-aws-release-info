import * as React from "react";
import { ReleaseBoardComponent } from "./release-board.component";
import { BuildInfoVm, ReleaseSteps, BoardReleaseInfo, ReleaseHeader } from "./release.vm";
import { getInfo, lastWeekReleasesInfoUrl, upcomingReleaseInfoUrl, releaseInfoUrl } from '../../api/amazonaws.api'
import { mapBuildsFromApiToVm, mapBuildFromApiToVm } from "./release-board.mapper";
import { trackPromise } from "react-promise-tracker";
import { LoadingSpinerComponent } from "components/spinner";
import { orderBy, map } from "lodash";
import { SessionContext } from "core";

export const ReleaseBoardContainer = () => {
    const [inPreparation, setInPreparation] = React.useState([]);
    const [testingOnTestServer, setTestingOnTestServer] = React.useState([]);
    const [deployingLive, setDeployingLive] = React.useState([]);
    const [approved, setApproved] = React.useState([]);

    const sessionContext = React.useContext(SessionContext);
    const [timeout] = React.useState(sessionContext.refreshTimeout);

    const loadReleasesInfo = () => {
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {

            let upcomingReleases: BuildInfoVm[] = mapBuildsFromApiToVm(result.upcoming);

            upcomingReleases.map(elem => {
                trackPromise(getInfo(`${releaseInfoUrl}/${elem.rt}`).then(result => {
                    let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                    let boardReleaseInfo: BoardReleaseInfo = createBoardBuildInfo(releaseSteps);
                    if (boardReleaseInfo.releaseHeader.lastStep === ReleaseSteps.DeployTestSystem) {
                        testingOnTestServer.push(boardReleaseInfo);
                    } else {
                        inPreparation.push(boardReleaseInfo);
                    }
                }));
            });
            let deployingLiveBuild: BuildInfoVm = mapBuildFromApiToVm(result);
            if (deployingLiveBuild !== undefined && deployingLiveBuild.status === 'Live Deploy') {
                trackPromise(getInfo(`${releaseInfoUrl}/${deployingLiveBuild.rt}`).then(result => {
                    let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                    let boardReleaseInfo: BoardReleaseInfo = createBoardBuildInfo(releaseSteps);
                    deployingLive.push(boardReleaseInfo);
                }));
            }
        }));

        trackPromise(getInfo(lastWeekReleasesInfoUrl).then(result => {
            let approvedReleases: BoardReleaseInfo[] = getOnlyApprovedReleases(mapBuildsFromApiToVm(result.Items));
            setApproved(approvedReleases);
        }));
    }

    React.useEffect(() => {
        loadReleasesInfo();
    }, []);

    return (
        <>
            <LoadingSpinerComponent>
                <ReleaseBoardComponent
                    inPreparation={inPreparation}
                    testingOnTestServer={testingOnTestServer}
                    deployingLive={deployingLive}
                    approved={approved}
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

const createBoardBuildInfo = (builds: BuildInfoVm[]): BoardReleaseInfo => {
    let stepsMap = new Map<ReleaseSteps, BuildInfoVm>();

    orderBy(builds, ['build'], ['asc']).map(elem => {
        stepsMap.set(elem.step, elem);
    });

    let releaseSteps: BuildInfoVm[] = orderBy([...stepsMap.values()], ['build'], ['desc']);

    const releaseLastStep = releaseSteps[0];

    let releaseHeader: ReleaseHeader = {
        rt: releaseLastStep.rt,
        team: releaseLastStep.team,
        status: releaseLastStep.status,
        lastStep: releaseLastStep.step
    }

    return {
        releaseHeader,
        releaseSteps
    }
}
