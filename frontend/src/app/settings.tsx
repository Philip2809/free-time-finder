import { useEffect, useState } from "react";
import axios from 'axios';
import { EventsData } from "./helpers/generatedInterfaces";
import { Event } from "../utils/interfaces";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

interface props {
  setSettingsData: (e: { auth: string, pid: string, tids: string }) => void;
}

const sx = {
  input: { color: 'white'},
  label: { color: 'white!important' },
  fieldset: { borderColor: 'white!important' },
  '&': { width: '80%' }
}

const Settings = (props: props) => {

  const [auth, setAuth] = useState(localStorage.getItem("auth") ?? "");
  const [personId, setPersonId] = useState(localStorage.getItem("personId") ?? "");
  const [teacherIDs, setteacherIDs] = useState(localStorage.getItem("teacherIDs") ?? "");

  return (
    <div className='settings'>

      <div>

        <br />

        <p>Login to elevcentralen and enter the cookie "SCFORMSAUTH" here. This seams to need to be set every day</p>
        <TextField sx={sx} id="outlined-basic" label=".SCFORMSAUTH" defaultValue={auth} onInput={(e) => { setAuth((e.target as any)?.value ?? "") }} variant="outlined" />
        <br />
        <br />

        <p>This is sent in the data request to get the avaliable times, check network log when you are checking for avaliable times</p>
        <TextField sx={sx} id="outlined-basic" label="Person id" defaultValue={personId} onInput={(e) => { setPersonId((e.target as any)?.value ?? "") }} variant="outlined" />
        <br />
        <br />

        <p>This is the teacher ids, seperate by "," (e.g. "121,2123,2353,46234"). Use the html inspector when picking a teacher to get id</p>
        <TextField sx={sx} id="outlined-basic" label="Teacher ids" defaultValue={teacherIDs} onInput={(e) => { setteacherIDs((e.target as any)?.value ?? "") }} variant="outlined" />
        <br />
        <br />

        <p>Save the person-id, auth and TeacherIDs to localstorage</p>
        <Button onClick={ () => { 

            localStorage.setItem('auth', auth);
            localStorage.setItem('personId', personId);
            localStorage.setItem('teacherIDs', teacherIDs);

         } } color="success"  variant="outlined">Save</Button>
        <br />
        <br />
        
        <p>Show calendar, remeber to browse by week to get data then check by month if you want</p>
        <Button onClick={ () => { props.setSettingsData({ auth, pid: personId, tids: teacherIDs }); } } color="warning" variant="outlined">Get free times</Button>
         
        <br />
        <br />
        <span>
          When you get to weeks where there is just too much data, too many free times, the calendar can't handle it for some reason :/
          I am not really sure why it is happening but at that point it does not really matter anymore because then bacially all the teachers have free times
          so you can just go to elevcentralen and do it from there. This calendar is mainly for the nearest week or month to check for all the teachers at the same time.
          So far in the future where this problem happens, no one has really booked a time yet.
        </span>



      </div>

      
      

    </div>
  )
}

export default Settings;


