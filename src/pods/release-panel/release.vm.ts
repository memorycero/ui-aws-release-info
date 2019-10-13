export enum ReleaseSteps {
    StartRelease="Start Release",
    Build="Build",
    IntegrationTests="IT",
    IntegrationLatestDump="IT L.Dump",
    DeployTestSystem="WWW1",
    Live="Live Deploy",
    Approve="Approve",
    Cancel="Cancel"
}

export interface BuildInfoVm {
    rt: string,
    team: string,
    branch: string,
    status: string,
    step: ReleaseSteps,
    id: number,
    build: string
}

export interface ReleaseHeader {
    rt: string,
    team: string,
    status: string,
    lastStep: ReleaseSteps
}

export interface BoardReleaseInfo {
    releaseHeader:ReleaseHeader,
    releaseSteps?:BuildInfoVm[]
}