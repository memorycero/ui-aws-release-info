import { BuildInfoVm, ReleaseSteps } from "./release.vm";
import { BuildInfoApi } from "api/amazonaws.api";

export const mapBuildsFromApiToVm = (buildsApi: BuildInfoApi[]): BuildInfoVm[] => {
    let buildsVm: BuildInfoVm[] = [];
    buildsApi.map(elem => buildsVm.push(mapBuildFromApiToVm(elem)));
    return buildsVm;
};

export const mapBuildFromApiToVm = (buildsApi: BuildInfoApi): BuildInfoVm => {
    return {
        rt: buildsApi.rt,
        team: buildsApi.team,
        branch: buildsApi.branch,
        status: buildsApi.status,
        step: getReleseStepEnumValue(buildsApi.step),
        id: buildsApi.id,
        build: buildsApi.build
    };
};

const getReleseStepEnumValue = (stringValue:string):ReleaseSteps => {
    switch (stringValue) {
        case "Start Release":
            return ReleaseSteps.StartRelease;
        case "Build":
            return ReleaseSteps.Build;
        case "Integration Tests":
            return ReleaseSteps.IntegrationTests;
        case "Integration Tests with Latest Dump":
            return ReleaseSteps.IntegrationLatestDump;
        case "Deploy Testsystem":
            return ReleaseSteps.DeployTestSystem;
        case "Live Deploy":
            return ReleaseSteps.Live;
        case "Approve":
            return ReleaseSteps.Approve;
        case "Cancel":
            return ReleaseSteps.Cancel;
        default:
            return null;
    }
}
