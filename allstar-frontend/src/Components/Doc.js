import React, {useState,useContext,useEffect,useReducer} from 'react';
import API_URL from '../config.js'
import EdiText from 'react-editext'
import Modal from 'react-bootstrap/Modal'
import EditModal from "./EditModal.js";
import {AuthContext} from '../Context/AuthContext';
import {Context} from '../Context/Store'
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const Doc = (props) => {

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {finish_time: props.doc.finish_time, time_worked: props.doc.time_worked, note: props.doc.note}
  )
  const [globalState, dispatch] = useContext(Context);
  const [show, setShow] = useState(false);
  const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);

  const handleClose = (e) => setShow(false);

  const handleShow = () => setShow(true);

  const handleDelete = (e) => {
    props.deleteDocument(props.doc._id)
	}

  const handleModal = (e) => {
    handleShow()
	}

  const handleFinishTime = (time) => {
    setState({finish_time: time})
  }

// formats the document for the backend
  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  const handleTimeWorked = (e) => {
    setState({time_worked: e.target.value})
  }

  const handleNote = (e) => {
    setState({note: e.target.value})
  }

// puts the dates in a standard mm/dd/yy hh:mm format
  const formatDates = () => {
    const start = new Date(props.doc.start_time) // formated_Date - SDK returned date
    const finish = new Date(props.doc.finish_time) // formated_Date - SDK returned date

    const formattedStart = `${start.getMonth() +1}/${start.getDate()}/${start.getFullYear()} `
    const standardStart = toStandardTime(`${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`)
    const formattedFinish = `${finish.getMonth() +1}/${finish.getDate()}/${finish.getFullYear()} `
    const standardFinish = toStandardTime(`${finish.getHours()}:${finish.getMinutes()}:${finish.getSeconds()}`)

    return (
      <div className="dates">
        <li className="date"><b>Start Time:</b> {formattedStart + standardStart}</li>
        <li className="date"><b>Finish Time:</b> {formattedFinish + standardFinish}</li>
      </div>
    )
  }

// converts from military tine to standard time
  const toStandardTime = (value) => {
    if (value.length < 8) {
      value += '0'
    }
    if (value !== null && value !== undefined){ //If value is passed in
      if(value.indexOf('AM') > -1 || value.indexOf('PM') > -1){ //If time is already in standard time then don't format.
        return value;
      }
      else {
        if(value.length == 8){ //If value is the expected length for military time then process to standard time.
          var hour = value.substring ( 0,2 ); //Extract hour
          var minutes = value.substring ( 3,5 ); //Extract minutes
          var identifier = 'AM'; //Initialize AM PM identifier

          if(hour == 12){ //If hour is 12 then should set AM PM identifier to PM
            identifier = 'PM';
          }
          if(hour == 0){ //If hour is 0 then set to 12 for standard time 12 AM
            hour=12;
          }
          if(hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
            hour = hour - 12;
            identifier='PM';
          }
          return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
        }
        else { //If value is not the expected length than just return the value as is
          return value;
        }
      }
    }
  }

  return (
    <section className="doc">
      <section className="margin">
        <ol className="doc_list">
          {formatDates()}
          <EditModal doc={props.doc} handleClose={handleClose}
            handleShow={handleShow} show={show} handleFinishTime={handleFinishTime}
            editDocument={props.editDocument}  />
          <div>
            <li className="doc_elem">
              <TextField
                label="Time Worked (s)"
                margin="normal"
                value={props.doc.time_worked}
                name="time_worked"
              />
            </li>
            <li className="doc_elem">
              <TextField
                id="standard-multiline-flexible"
                label="Notes"
                multiline
                rows={4}
                rowsMax={4}
                width="100%"
                value={props.doc.note}
                name="note"
                fullWidth
              />
            </li>
          </div>
        </ol>
        <br/>
        <div className="buttons">
          <div className="button--1">
              <Button
                variant="contained"
                color="primary"
                startIcon={<CreateIcon />}
                onClick={handleModal}
              >
                Edit
              </Button>
            </div>
            <div className="button--delete">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
              Delete
            </Button>
          </div>
        </div>
      </section>
    </section>
  )
}
export default Doc
