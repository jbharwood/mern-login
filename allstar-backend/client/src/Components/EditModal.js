import React, {useState,useContext,useEffect,useReducer} from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Modal from 'react-bootstrap/Modal'
// import Button from 'react-bootstrap/Button';
import API_URL from '../config.js'
import EdiText from 'react-editext'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Context} from '../Context/Store'
import SaveIcon from '@material-ui/icons/Save';

const EditModal = props => {

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {finish_time: props.doc.finish_time, note: props.doc.note,
      time_worked: props.doc.time_worked}
  )
  const [globalState, dispatch] = useContext(Context);

  const handleDateChange = (date) => {
    setState({finish_time: date})
  };

  const handleTimeWorked = (e) => {
    setState({time_worked: e.target.value})
  }

  const handleNote = (e) => {
    setState({note: e.target.value})
  }

// formats the document for the backend
  const handleSubmit = () => {
    const userID = globalState.currentUser._id
    // _id: "5e9a51241a79771042263814",
    const doc = {
      _id: userID,
      doc_id: props.doc._id,
      documents:
        {
          start_time: state.finish_time,
          note: state.note,
          finish_time: state.finish_time,
          time_worked: parseInt(state.time_worked)
        }
    }
    props.editDocument(doc, props.doc._id)
    props.handleClose()
  }

  const renderForm = () => {
    if (props.show === true) {
      return (
        <form onSubmit={handleSubmit} action="">
          <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Finish Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                      label="Time Worked (s)"
                      margin="normal"
                      value={state.time_worked}
                      name="time_worked"
                      onChange={handleTimeWorked}
                    />
                    <TextField
                      id="standard-multiline-flexible"
                      label="Notes"
                      multiline
                      rows={4}
                      rowsMax={4}
                      width="100%"
                      value={state.note}
                      name="note"
                      onChange={handleNote}
                      fullWidth
                    />
                </Grid>
              </MuiPickersUtilsProvider>
            </Modal.Body>
            <Modal.Footer>
              <div className="button--close">
                <Button variant="contained" color="secondary" onClick={props.handleClose}>
                  Close
                </Button>
              </div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
              >
              Save
            </Button>
            </Modal.Footer>
          </Modal>
        </form>
      )
    }
  }

  return (
    <div className="ui secondary segment postForm">
      {renderForm()}
    </div>
  );
}

export default EditModal;
