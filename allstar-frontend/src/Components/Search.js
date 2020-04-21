import React, {useState,useContext,useEffect,useReducer} from 'react';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { TextField } from '@material-ui/core';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';

const Search = props => {

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {finish_time: Date.now(), start_time: Date.now(), input: ""}
  )

  const handleTyping = (e) => {
    e.preventDefault()
    setState({input: e.target.value})
    let text = e.target.value;
    text = text.toLowerCase()
    props.filterUsers(text)
  }

  const handleFinishTime = (time) => {
    setState({finish_time: time})
  };

  const handleStartTime = (time) => {
    setState({start_time: time})
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    props.filterDates(state)
  }

  return (
    <article className="search">
      <form
        onKeyPress={e => {
            if (e.which === 13 /* Enter */) {
              e.preventDefault();
            }
          }}
        >
            <TextField
              label=""
              style={{ width: "100%", fill: "black"}}
              onChange={handleTyping}
              placeholder="Search Notes"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
      </form>
      <form onSubmit={handleSubmit} action="">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Start Date Picker"
              format="MM/dd/yyyy"
              value={state.start_time}
              onChange={handleStartTime}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Finish Date Picker"
              format="MM/dd/yyyy"
              value={state.finish_time}
              onChange={handleFinishTime}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid container justify="space-around">
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Start Time Picker"
              value={state.start_time}
              onChange={handleStartTime}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Finish Time Picker"
              value={state.finish_time}
              onChange={handleFinishTime}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <div className="buttons">
          <div className="button--3">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </div>
          <div className="button--4">
              <Button
                variant="contained"
                color="primary"
                onClick={props.fetchUsers}
                startIcon={<PeopleIcon />}
              >
              Show All
              </Button>
          </div>
        </div>
      </form>
    </article>
  )
}
export default Search
