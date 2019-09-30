import * as React from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { IconButton } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

interface Props {
  rt: string,
  team: string,
  branch?: string,
  status?: string,
  step?: string,
  id?: number,
  build?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    avatar: {
      margin: 10,
      width: 50,
      height: 50,
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
  const { rt, team } = props;
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(false);

  const teamLowerCase = team.toLowerCase();
  const teamLogo = require(`../../../icons/teams-icons/${teamLowerCase}-icon.png`);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardContent>
        <img alt="Team Icon" src={teamLogo} className={classes.avatar} />
        <Typography variant="h5" component="h2">
          {team}
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {rt}
        </Typography>
      </CardContent>
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
          <Typography paragraph>All steps...Soon !</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
