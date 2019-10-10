export enum ReleaseStep {
    StartRelease="Start Release",
    Build="Build",
    IntegrationTests="IT",
    IntegrationLatestDump="IT L.Dump",
    DeployTestSystem="WWW1",
    Live="Live",
    Approve="Approve",
    Cancel="Cancel"
}

export interface BuildInfoVm {
    rt: string,
    team: string,
    branch: string,
    status: string,
    step: ReleaseStep,
    id: number,
    build: string
}

export interface BuildHeader {
    rt: string,
    team: string,
    status: string,
    lastStep: ReleaseStep
}

export interface BoardBuildInfo {
    buildHeader:BuildHeader;
    buildsSteps?:BuildInfoVm[];
}