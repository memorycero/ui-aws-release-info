import * as React from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { IconButton } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { BuildInfoVm, ReleaseHeader } from "../release.vm";

interface Props {
  buildHeader: ReleaseHeader;
  buildsSteps?: BuildInfoVm[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: 14,
    },
    avatar: {
      width: 60,
      height: 60,
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    }
  }),
);

export const BuildCardComponent = (props: Props) => {
  const { buildHeader, buildsSteps } = props;
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(false);

  const teamLowerCase = buildHeader.team.toLowerCase();
  const teamLogo = require(`../../../icons/teams-icons/${teamLowerCase}-icon.png`);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <img alt="Team Icon" src={teamLogo} className={classes.avatar} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" component="h2">
              {buildHeader.team}
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {buildHeader.rt}
            </Typography>
            <Grid item container spacing={2}>
              <Grid item xs={7}>
                <Typography variant="h6">
                  Status:
                </Typography>
              </Grid>
              <Grid item xs={3}>
                {renderStatusComponent(buildHeader.status)}
              </Grid>
            </Grid>
          </Grid>
          <div>
            {buildsSteps !== undefined
              ?
              <Grid item xs={12}>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    {buildsSteps.map((elem: BuildInfoVm) => (
                      <div key={elem.id}>
                        <Grid item container spacing={2}>
                          <Grid item xs={9}>
                            <Typography variant="body1">
                              {elem.step}:
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            {renderStatusComponent(elem.status)}
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </CardContent>
                </Collapse>
              </Grid>
              :
              <div />
            }
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

function renderStatusComponent(status) {
  return (
    <>
      {'SUCCESS' === status
        ?
        <CheckCircleIcon htmlColor='green' />
        :
        <ErrorIcon htmlColor='red' />
      }
    </>
  )
}
