import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { BoardReleaseInfo } from "./release.vm";
import { BuildCardComponent } from "./components/build-card.component";
import { orderBy } from "lodash";

interface Props {
  releasesInPreparation: BoardReleaseInfo[],
  releasesOnWww1: BoardReleaseInfo[],
  releasesLive: BoardReleaseInfo[],
  releasesApproved: BoardReleaseInfo[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      textAlign: 'center'
    },
  })
);

export const ReleaseBoardComponent = (props: Props) => {
  const { releasesInPreparation, releasesOnWww1, releasesLive, releasesApproved } = props;
  const classes = useStyles({});

  return (
    <>
      {/* Headers */}
      {buildHeaderComponent('In Preparation', classes.paper)}
      {buildHeaderComponent('www1', classes.paper)}
      {buildHeaderComponent('Live Deployment', classes.paper)}
      {buildHeaderComponent('Approved', classes.paper)}
      {/* In Preparation queue */}
      {buildReleaseComponent(releasesInPreparation, 'asc')}
      {/* WWW1 queue */}
      {buildReleaseComponent(releasesOnWww1, 'asc')}
      {/* Live Deploy queue */}
      {buildReleaseComponent(releasesLive, 'asc')}
      {/* Approved queue */}
      {buildReleaseComponent(releasesApproved, 'desc')}
    </>
  )
}

const buildHeaderComponent = (stepName: string, paperClassName: string) => {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={paperClassName}>
          <Typography variant="h6" color="primary" gutterBottom>
            {stepName}
          </Typography>
        </Paper>
      </Grid>
    </>
  )
}

const buildReleaseComponent = (releases: BoardReleaseInfo[], order) => {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        {orderBy(releases, ['releaseHeader.rt'], order).map(value => (
          <div key={value.releaseHeader.rt}>
            <BuildCardComponent buildHeader={value.releaseHeader} buildsSteps={value.releaseSteps} />
            <br />
          </div>
        ))}
      </Grid>
    </>
  )
}