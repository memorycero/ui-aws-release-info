import * as React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { BuildInfo } from "./release.vm";
import { Divider } from "@material-ui/core";
import { BuildCardComponent } from "./components/build-card.component";

interface Props {
  inPreparation: BuildInfo[],
  testingOnTestServer: BuildInfo[],
  deployingLive: BuildInfo[],
  approved: BuildInfo[],
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fixedHeight: {
      height: '10vh',
    },
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

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Typography component="h3" variant="h6" color="primary" gutterBottom>
            In Preparation
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Typography component="h3" variant="h6" color="primary" gutterBottom>
            www1
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Typography component="h3" variant="h6" color="primary" gutterBottom>
            Live Deployment
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Typography component="h3" variant="h6" color="primary" gutterBottom>
            Approved
          </Typography>
        </Paper>
      </Grid>
      {/* In Preparation */}
      <Grid item xs={12} md={4} lg={3}>
        {inPreparation.map(build => (
          <div>
            <BuildCardComponent rt={build.rt}
              team={build.team}
              branch={build.branch}
              status={build.status}
              step={build.step}
              id={build.id}
              build={build.build} />
            <br />
          </div>
        ))}
      </Grid>
      {/* WWW1 */}
      <Grid item xs={12} md={4} lg={3}>
        {testingOnTestServer.map(build => (
          <div>
            <BuildCardComponent rt={build.rt}
              team={build.team}
              branch={build.branch}
              status={build.status}
              step={build.step}
              id={build.id}
              build={build.build} />
            <br />
          </div>
        ))}
      </Grid>
      {/* Live deployment */}
      <Grid item xs={12} md={4} lg={3}>
        {deployingLive.map(build => (
          <div>
            <BuildCardComponent rt={build.rt}
              team={build.team}
              branch={build.branch}
              status={build.status}
              step={build.step}
              id={build.id}
              build={build.build} />
            <br />
          </div>
        ))}
      </Grid>
      {/* Approved */}
      <Grid item xs={12} md={4} lg={3}>
        {approved.map(build => (
          <div>
            <BuildCardComponent rt={build.rt}
              team={build.team}
              branch={build.branch}
              status={build.status}
              step={build.step}
              id={build.id}
              build={build.build} />
            <br />
          </div>
        ))}
      </Grid>
    </>
  )
}

const BuildInfoComponent = (builds: BuildInfo[]) => {
  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        {builds.map(elem => (
          <div>
            <BuildCardComponent rt={elem.rt}
              team={elem.team}
              branch={elem.branch}
              status={elem.status}
              step={elem.step}
              id={elem.id}
              build={elem.build} />
            <br />
          </div>
        ))}
      </Grid>
    </>
  )
}
