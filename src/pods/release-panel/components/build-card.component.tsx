import * as React from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { IconButton, Link, Tooltip } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import { BuildInfoVm, ReleaseHeader } from "../release.vm";
import { teamCityViewLog } from "core/const";

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
  const teamLogo = getTeamIconPath(buildHeader.team);

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
                <Tooltip title={`${buildHeader.status}`}>
                  {returnStatusComponent(buildHeader.status)}
                </Tooltip>
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
                            <Link href={`${teamCityViewLog}${elem.build}`} target="_blank" rel="noopener" variant="body1">
                              {elem.step}
                            </Link>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title={`${elem.status}`}>
                              {returnStatusComponent(elem.status)}
                            </Tooltip>
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

const returnStatusComponent = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return <CheckCircleIcon htmlColor='green' />;
    case 'FAILURE':
      return <ErrorIcon htmlColor='red' />;
    case 'WARN':
      return <WarningIcon htmlColor='orange' />;
    case 'CANCELED':
      return <CancelIcon htmlColor='red' />;
    default:
      return <HelpIcon htmlColor='grey' />;
  }
}

const getTeamIconPath = (teamName: string): string => {
  try {
    const teamLowerCase = teamName.toLowerCase();
    return require(`../../../icons/teams-icons/${teamLowerCase}-icon.png`);
  }
  catch (error) {
    console.error(`Team name: ${teamName} doesn't exist.`);
    return require(`../../../icons/teams-icons/default-icon.png`);
  }
}
