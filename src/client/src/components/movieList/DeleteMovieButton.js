import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function DeleteMovieButton(props) {
  const { movieId, movieTitle, handleDelete } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
          edge="end" aria-label="delete"
          onClick={handleClickOpen}
        >
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure about deleting the movie "${movieTitle}"?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={() => handleDelete(movieId)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteMovieButton.propTypes = {
  movieId: PropTypes.string.isRequired,
  movieTitle: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
