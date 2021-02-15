import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles, MenuItem, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    padding: '30px',
  },
  criterion: {
    width: '20%',
    marginRight: '2.5%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: '0',
    },
  },
  search: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '10px 0 10px 0',
    },
  },
  searchBtn: {
    width: '20%',
    marginLeft: '2.5%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: '0',
    },
  },
}));

export default function MoviesSearch(props) {
  const { handleSearch } = props;
  const [searchCriterion, setSearchCriterion] = React.useState('title');
  const [searchValue, setSearchValue] = React.useState('');

  const handleCriterionChange = (event) => {
    setSearchCriterion(event.target.value);
  };

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  }

  const classes = useStyles();

  return (
    <form className={classes.form} onSubmit={(event) => handleSearch(event)}>
      <TextField
        id="outlined-basic" label="Search by:" variant="outlined" select
        value={searchCriterion} onChange={handleCriterionChange} size="small"
        className={classes.criterion} name="criterion"
      >
        <MenuItem key="title" value="title">Title</MenuItem>
        <MenuItem key="actor" value="actor">Actor</MenuItem>
      </TextField>
      <TextField
        id="outlined-basic" label={`Enter ${searchCriterion}...`} name="searchValue"
        variant="outlined" size="small" className={classes.search} inputProps={{ maxLength: 255 }}
        value={searchValue} onChange={handleSearchValueChange} required
      />
      <Button
        variant="contained" color="primary" type="submit"
        className={classes.searchBtn}
      >
        Search
      </Button>
    </form>
  );
}

MoviesSearch.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};
