import React from 'react';
import {
  Button, makeStyles, MenuItem, TextField,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: '20px',
  },
}));

const isValidMovieForm = (movieData) => {
  const { title, actors } = movieData;
  if (title.trim() === '') {
    alert('Please, provide a non-blank title.');
    return false;
  }
  actors.forEach((actor) => {
    if (actor.length > 255) {
      alert('The name of each actor must be less than 256 characters long.');
      return false;
    }
  });
  return true;
};

export default function AddMovieForm() {
  const [title, setTitle] = React.useState('');
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [format, setFormat] = React.useState('Blu-Ray');
  const [actors, setActors] = React.useState('');

  const handleChange = (event, stateSetter) => {
    stateSetter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = document.getElementsByName('title')[0].value;
    const year = parseInt(document.getElementsByName('year')[0].value);
    const format = document.getElementsByName('format')[0].value;
    const actors = document.getElementsByName('actors')[0].value
      .split(/, */).map((actor) => actor.trim());

    if (!isValidMovieForm({ title, actors })) return;

    const res = await fetch('/api/movies', {
      method: 'POST',
      body: JSON.stringify({ title, year, format, actors }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.status !== 200)
      alert('Failed to add the movie.');
    else
      alert('A movie was added successfully.');
  };

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="outlined-basic" label="Title" variant="outlined" fullWidth={true}
        margin="normal" name="title" value={title}
        inputProps={{ maxLength: 255 }}
        onChange={(event) => handleChange(event, setTitle)} required
      />
      <TextField
        id="outlined-basic" label="Year" variant="outlined" fullWidth={true}
        margin="normal" name="year" value={year} type="number"
        inputProps={{ min:1888, max: new Date().getFullYear() + 30 }}
        onChange={(event) => handleChange(event, setYear)} required
      />
      <TextField
        id="outlined-basic" label="Format" variant="outlined" fullWidth={true}
        margin="normal" name="format" value={format} select
        onChange={(event) => handleChange(event, setFormat)}
      >
        <MenuItem key="VHS" value="VHS">VHS</MenuItem>
        <MenuItem key="DVD" value="DVD">DVD</MenuItem>
        <MenuItem key="Blu-Ray" value="Blu-Ray">Blu-Ray</MenuItem>
      </TextField>
      <TextField
        id="outlined-basic" label="Actors"
        variant="outlined" fullWidth={true} margin="normal" name="actors" value={actors}
        inputProps={{
          pattern: '(([A-za-z]+( +[A-za-z]+)*)(, *)?)+',
          title: 'Actors\' names must be comma separated words (or multiple words) containing english letters.',
        }}
        onChange={(event) => handleChange(event, setActors)} required
      />
      <Button 
        className={classes.addButton} variant="contained"
        color="primary" type="submit"
      >
        Add new movie
      </Button>
    </form>
  );
}
