import * as React from "react";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";

interface Props {
    refreshTimeout: number;
    updateRefreshTimeout: (value: number) => void;
}

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #ced4da',
            fontSize: 16,
            width: 'auto',
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }),
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        margin: {
            margin: theme.spacing(0),
        },
    }),
);

export const SettingsComponent = (props: Props) => {
    const { refreshTimeout, updateRefreshTimeout } = props;
    const classes = useStyles({});

    const [selectedOption] = React.useState(refreshTimeout);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) =>
        updateRefreshTimeout(event.target.value as number);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid item container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h6">
                                Refresh Time:
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={classes.margin}>
                                <InputLabel htmlFor="timeout-combo-id">(Seconds)</InputLabel>
                                <NativeSelect
                                    value={selectedOption}
                                    onChange={handleChange}
                                    input={<BootstrapInput name="Seconds" id="timeout-combo-id" />}
                                >
                                    <option value={30000}>30</option>
                                    <option value={60000}>60</option>
                                    <option value={120000}>120</option>
                                    <option value={180000}>180</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}