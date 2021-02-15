import React from 'react';
import {
  Divider, makeStyles, Paper, Typography,
} from '@material-ui/core';
import AddMovieForm from './AddMovieForm';
import ImportMoviesForm from './ImportMoviesForm';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    marginTop: '30px',
  },
  form: {
    padding: '30px',
  },
}));

export default function AddMovie() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={3}>
      <div className={classes.form}>
        <Typography variant="h4" align="center">
          Add new movie
        </Typography>
        <AddMovieForm />
      </div>
      <Divider />
      <div className={classes.form}>
        <Typography variant="h5" align="center">
          You can also import movie list from a file
        </Typography>
        <ImportMoviesForm />
      </div>
    </Paper>
  );
}
