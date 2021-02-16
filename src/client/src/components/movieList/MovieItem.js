import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import { makeStyles } from '@material-ui/core';
import DeleteMovieButton from './DeleteMovieButton';

const useStyles = makeStyles((theme) => ({
  movieTitleLink: {
    textDecoration: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export default function MovieItem(props) {
  const { movieData, setMovieList } = props;

  const handleDelete = async (id) => {
    const res = await fetch(`/api/movies/${id}`, {
      method: 'DELETE',
    });
    if (res.status !== 200) {
      alert('Failed to delete the movie.');
    } else {
      const res = await fetch('/api/movies');
      const list = await res.json();
      setMovieList(list);
    }
  };

  const classes = useStyles();

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <LocalMoviesIcon />
        </Avatar>
      </ListItemAvatar>
      <Link to={`/movie/${movieData.id}`} className={classes.movieTitleLink}>
        <ListItemText
          primary={movieData.title}
          secondary={`Release year: ${movieData.year}. Format: ${movieData.format}`}
        />
      </Link>
      <ListItemSecondaryAction>
        <DeleteMovieButton
          movieId={movieData.id}
          movieTitle={movieData.title}
          handleDelete={handleDelete}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

MovieItem.propTypes = {
  movieData: PropTypes.object.isRequired,
  setMovieList: PropTypes.func.isRequired,
};
