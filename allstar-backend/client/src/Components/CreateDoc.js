import React, {useState,useContext,useEffect,useReducer} from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {AuthContext} from '../Context/AuthContext';
import {Context} from '../Context/Store'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(50),
      width: '25ch',
    },
  },
}));

const CreateDoc = props => {

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {finish_time: Date.now(), time_worked: '', note: ""}
  )
  const [globalState, dispatch] = useContext(Context);
  const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);

  const handleDateChange = (date) => {
    setState({finish_time: date})
  };

  const onChange = e => {
    setState({
      [e.target.name]: e.target.value
    });
  };

// creates document and formats it for the backend
  const handleSubmit = e => {
    e.preventDefault();
    const userID = globalState.currentUser._id
    const input = {
      _id: userID,
      documents:
  			{
  				start_time: state.finish_time,
          note: state.note,
  				finish_time: state.finish_time,
  				time_worked: parseInt(state.time_worked)
  			}
    }

    props.createDocument(input)
    setState({
      finish_time: Date.now(),
      time_worked: '',
      note: ''
    });
  };

  return (
    <div className="createDoc">
      <form onSubmit={handleSubmit} action="">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Finish Date Picker"
              format="MM/dd/yyyy"
              value={state.finish_time}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Finish Time Picker"
              value={state.finish_time}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <TextField
              required
              id="filled-required"
              label="Time Worked (s)"
              defaultValue="Hello World"
              value={state.time_worked}
              onChange={onChange}
              name="time_worked"
              margin="normal"
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <TextField
          id="standard-multiline-flexible"
          label="Notes"
          multiline
          rows={4}
          rowsMax={4}
          width="100%"
          value={state.note}
          name="note"
          onChange={onChange}
          fullWidth
        />
        <br/>
        <br/>
        <div className="ui fluid input">
          <Button variant="contained" color="primary" type="submit">
            Create Work Document
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateDoc;
