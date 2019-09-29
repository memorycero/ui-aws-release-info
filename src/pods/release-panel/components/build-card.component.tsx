import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';



interface Props { 
  rt: string,
  team: string,
  branch?: string,
  status?: string,
  step?: string,
  id?: number,
  build?: string
}

const useStyles = makeStyles({
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
  }
});

export const BuildCardComponent = (props:Props) => {
  const {rt, team} = props;
  const classes = useStyles({});

  const teamLowerCase = team.toLowerCase();
  const blinkyLogo = require(`../../../icons/teams-icons/${teamLowerCase}-icon.png`);
  return (
    <Card>
      <CardContent>
      <img alt="Team Icon" src={blinkyLogo} className={classes.avatar} />
        <Typography variant="h5" component="h2">
          {team}
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {rt}
        </Typography>
      </CardContent>
    </Card>
  );
}
