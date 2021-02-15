import React from 'react';
import {
  Button, makeStyles, MenuItem, TextField,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: '20px',
  },
}));

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
      .split(/,\s*/);

    console.log({ title, year, format, actors });

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
        margin="normal" inputProps={{ maxLength: 255 }} name="title"
        value={title} required
        onChange={(event) => handleChange(event, setTitle)}
      />
      <TextField
        id="outlined-basic" label="Year" variant="outlined" fullWidth={true}
        margin="normal" name="year" value={year} type="number" required
        onChange={(event) => handleChange(event, setYear)}
      />
      <TextField
        id="outlined-basic" label="Format" variant="outlined" fullWidth={true}
        margin="normal" value={format} name="format" select
        onChange={(event) => handleChange(event, setFormat)}
      >
        <MenuItem key="VHS" value="VHS">VHS</MenuItem>
        <MenuItem key="DVD" value="DVD">DVD</MenuItem>
        <MenuItem key="Blu-Ray" value="Blu-Ray">Blu-Ray</MenuItem>
      </TextField>
      <TextField
        id="outlined-basic" label="Actors" variant="outlined"
        fullWidth={true} margin="normal" name="actors" 
        value={actors} required
        onChange={(event) => handleChange(event, setActors)}
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
