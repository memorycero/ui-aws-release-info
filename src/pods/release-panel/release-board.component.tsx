import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { BoardReleaseInfo } from "./release.vm";
import { BuildCardComponent } from "./components/build-card.component";

interface Props {
  inPreparation: BoardReleaseInfo[],
  testingOnTestServer: BoardReleaseInfo[],
  deployingLive: BoardReleaseInfo[],
  approved: BoardReleaseInfo[],
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
  const { inPreparation, testingOnTestServer, deployingLive, approved } = props;
  const classes = useStyles({});

  return (
    <>
      {/* Headers */}
      {buildHeaderComponent('In Preparation', classes.paper)}
      {buildHeaderComponent('www1', classes.paper)}
      {buildHeaderComponent('Live Deployment', classes.paper)}
      {buildHeaderComponent('Approved', classes.paper)}
      {/* In Preparation */}
      {buildReleaseComponent(inPreparation)}
      {/* WWW1 */}
      {buildReleaseComponent(testingOnTestServer)}
      {/* Live Deploy */}
      {buildReleaseComponent(deployingLive)}
      {/* Approved */}
      {buildReleaseComponent(approved)}
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

const buildReleaseComponent = (releases: BoardReleaseInfo[]) => {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        {releases.map(value => (
          <div key={value.releaseHeader.rt}>
            <BuildCardComponent buildHeader={value.releaseHeader} buildsSteps={value.releaseSteps} />
            <br />
          </div>
        ))}
      </Grid>
    </>
  )
}