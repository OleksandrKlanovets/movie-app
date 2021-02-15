import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  importButton: {
    margin: '20px',
  },
}));

export default function ImportMoviesForm() {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const classes = useStyles();

  const handleFileSelection = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('movieList', selectedFile);
    const res = await fetch('/api/movies-from-file', {
      method: 'POST',
      body: data,
    });
    if (res.status !== 200)
      alert('Failed to import movies.');
    else
      alert('Movies were imported successfully.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        { selectedFile ? `Chosen file: ${selectedFile.name}` : '' }
      </p>

      <Button
        className={classes.importButton}
        variant="contained"
        component="label"
      >
        Choose file
        <input
          onChange={handleFileSelection}
          name="moviesFile"
          type="file"
          hidden
          required
        />
      </Button>

      <Button
        className={classes.importButton}
        variant="contained"
        color="primary"
        type="submit"
      >
        Upload file
      </Button>
    </form>
  );
}
