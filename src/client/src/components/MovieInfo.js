import React from 'react';
import { Button, Container, makeStyles, Paper, Typography } from '@material-ui/core';
import { useParams, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    marginTop: '30px',
    padding: '30px',
  },
}));

export default function MovieInfo() {
  const { movieId } = useParams();
  const [movie, setMovie] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/movies/${movieId}`);
      if (res.status === 404 || res.status === 400) {
        setMovie(null);
      } else {
        const movie = await res.json();
        setMovie(movie);
      }
    }
    fetchData();
  }, [movieId]);

  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" align="center">
          Movie info
        </Typography>
        {
          movie ?
            <p style={{textAlign: 'left'}}>
              Title: {movie.title}<br />
              Release year: {movie.year}<br />
              Format: {movie.format}<br />
              Actors: {movie.Actors.reduce(
                (str, actor, i) => str + actor.name + ((i === movie.Actors.length - 1) ? '' : ', '),
                '',
              )}
            </p> :
            <p>Movie was not found.</p>
        }
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained">
            Back to main
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
