import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Divider, Paper, Typography } from '@material-ui/core';
import MoviesSearch from './MoviesSearch';
import MovieItem from './MovieItem';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    margin: '30px 0 30px 0',
    padding: '30px',
  },
}));

export default function MovieList() {
  const [movieList, setMovieList] = React.useState([]);

  const fetchList = async () => {
    const res = await fetch('/api/movies');
    const list = await res.json();
    setMovieList(list);
  } 

  React.useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const criterion = document.getElementsByName('criterion')[0].value;
    const searchValue = document.getElementsByName('searchValue')[0].value;
    const res = await fetch(
      `/api/movies-by-${criterion}/${searchValue}`
    );
    if (res.status === 404) {
      setMovieList([]);
    } else {
      const list = await res.json();
      setMovieList(list);
    }
  };

  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h4" align="center">
        Movie list
      </Typography>
      <MoviesSearch handleSearch={handleSearch} fetchList={fetchList} />
      <Divider />
      <List>
        {
          movieList.length ?
            movieList.map(
              (movie) => (
                <MovieItem 
                  key={movie.id} movieData={movie} setMovieList={setMovieList}
                />
              )
            ) :
            <p>No movies were found.</p>
        }
      </List>
    </Paper>
  );
}
