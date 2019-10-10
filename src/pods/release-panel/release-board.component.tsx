import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { BoardBuildInfo } from "./release.vm";
import { BuildCardComponent } from "./components/build-card.component";

interface Props {
  inPreparation: BoardBuildInfo[],
  testingOnTestServer: BoardBuildInfo[],
  deployingLive: BoardBuildInfo[],
  approved: BoardBuildInfo[],
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
      {headerInfoComponent('In Preparation', classes.paper)}
      {headerInfoComponent('www1', classes.paper)}
      {headerInfoComponent('Live Deployment', classes.paper)}
      {headerInfoComponent('Approved', classes.paper)}
      {/* In Preparation */}
      {buildInfoComponent(inPreparation)}
      {/* WWW1 */}
      {buildInfoComponent(testingOnTestServer)}
      {/* Live deployment */}
      {buildInfoComponent(deployingLive)}
      {/* Approved */}
      {buildInfoComponent(approved)}
    </>
  )
}

function headerInfoComponent(nameStep, paperClassName) {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={paperClassName}>
          <Typography component="h3" variant="h6" color="primary" gutterBottom>
            {nameStep}
          </Typography>
        </Paper>
      </Grid>
    </>
  )
}

function buildInfoComponent(builds) {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        {builds.map(value => (
          <div key={value.buildHeader.rt}>
            <BuildCardComponent buildHeader={value.buildHeader} buildsSteps={value.buildsSteps}/>
            <br />
          </div>
        ))}
      </Grid>
    </>
  )
}