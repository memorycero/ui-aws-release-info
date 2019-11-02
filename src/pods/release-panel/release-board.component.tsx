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

  return (
    <>
      {buildReleasesColumn('In Preparation', releasesInPreparation, 'asc')}
      {buildReleasesColumn('www1',  releasesOnWww1, 'asc')}
      {buildReleasesColumn('Live Deployment', releasesLive, 'asc')}
      {buildReleasesColumn('Approved', releasesApproved, 'desc')}
    </>
  )
}

const buildReleasesColumn = (stepName: string, releases: BoardReleaseInfo[], order: any) => {
  const classes = useStyles({});
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Typography variant="h6" color="primary" gutterBottom>
            {stepName}
          </Typography>
        </Paper>
        <br />
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