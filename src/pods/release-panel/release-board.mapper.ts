import { BuildInfoVm, ReleaseStep } from "./release.vm";
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
        step: getEnumValue(buildsApi.step),
        id: buildsApi.id,
        build: buildsApi.build
    };
};

function getEnumValue(enumValue) {
    switch (enumValue) {
        case "Start Release":
            return ReleaseStep.StartRelease;
        case "Build":
            return ReleaseStep.Build;
        case "Integration Tests":
            return ReleaseStep.IntegrationTests;
        case "Integration Tests with Latest Dump":
            return ReleaseStep.IntegrationLatestDump;
        case "Deploy Testsystem":
            return ReleaseStep.DeployTestSystem;
        case "Live Deploy":
            return ReleaseStep.Live;
        case "Approve":
            return ReleaseStep.Approve;
        case "Cancel":
            return ReleaseStep.Cancel;
        default:
            return null;
    }
}
