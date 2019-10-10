import * as React from "react";
import { ReleaseBoardComponent } from "./release-board.component";
import { BuildInfoVm, ReleaseStep, BoardBuildInfo, BuildHeader } from "./release.vm";
import { getInfo, lastWeekReleasesInfoUrl, upcomingReleaseInfoUrl, releaseInfoUrl } from '../../api/amazonaws.api'
import { mapBuildsFromApiToVm, mapBuildFromApiToVm } from "./release-board.mapper";
import { trackPromise } from "react-promise-tracker";
import { LoadingSpinerComponent } from "components/spinner";
import { orderBy, map } from "lodash";

export const HotelEditionContainer = () => {
    const [inPreparation, setInPreparation] = React.useState([]);
    const [testingOnTestServer, setTestingOnTestServer] = React.useState([]);
    const [deployingLive, setDeployingLive] = React.useState([]);
    const [approved, setApproved] = React.useState([]);

    const loadReleaseInfo = () => {
        trackPromise(getInfo(upcomingReleaseInfoUrl).then(result => {

            let upcomingReleases: BuildInfoVm[] = mapBuildsFromApiToVm(result.upcoming);

            upcomingReleases.map(elem => {
                trackPromise(getInfo(`${releaseInfoUrl}/${elem.rt}`).then(result => {
                    let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                    let boardInfo: BoardBuildInfo = createBoardBuildInfo(releaseSteps)
                    if (boardInfo.buildHeader.lastStep === ReleaseStep.DeployTestSystem) {
                        testingOnTestServer.push(boardInfo);
                    } else {
                        inPreparation.push(boardInfo);
                    }
                }));
            });
            let deployingLiveBuild: BuildInfoVm = mapBuildFromApiToVm(result);
            if (deployingLiveBuild !== undefined && deployingLiveBuild.status === 'Live Deploy') {
                trackPromise(getInfo(`${releaseInfoUrl}/${deployingLiveBuild.rt}`).then(result => {
                    let releaseSteps: BuildInfoVm[] = mapBuildsFromApiToVm(result.Items);
                    let boardInfo: BoardBuildInfo = createBoardBuildInfo(releaseSteps)
                    deployingLive.push(boardInfo);
                }));
            }
        }));

        trackPromise(getInfo(lastWeekReleasesInfoUrl).then(result => {
            let approvedReleases: BoardBuildInfo[] = getOnlyApprovedReleases(mapBuildsFromApiToVm(result.Items));
            setApproved(approvedReleases);
        }));
    }

    React.useEffect(() => {
        loadReleaseInfo();
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

const getOnlyApprovedReleases = (builds: BuildInfoVm[]): BoardBuildInfo[] => {
    let result: BoardBuildInfo[] = [];
    orderBy(builds, ['build'], ['desc']).filter(build => build.step === ReleaseStep.Approve).map(build => {
        let buildHeader: BuildHeader = {
            rt: build.rt,
            team: build.team,
            status: build.status,
            lastStep: build.step
        }
        result.push({
            buildHeader
        })
    })
    return result;
}

const createBoardBuildInfo = (builds: BuildInfoVm[]): BoardBuildInfo => {
    let stepsMap = new Map<ReleaseStep, BuildInfoVm>();

    orderBy(builds, ['build'], ['asc']).map(elem => {
        stepsMap.set(elem.step, elem);
    });

    let buildsSteps: BuildInfoVm[] = orderBy([...stepsMap.values()], ['build'], ['desc']);

    const releaseLastStep = buildsSteps[0];

    let buildHeader: BuildHeader = {
        rt: releaseLastStep.rt,
        team: releaseLastStep.team,
        status: releaseLastStep.status,
        lastStep: releaseLastStep.step
    }

    return {
        buildHeader,
        buildsSteps
    }
}
