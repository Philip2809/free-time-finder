import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Logincard from "../../components/logincard";

interface props {
  setSettingsData: (e: { auth: string, pid: string, tids: string }) => void;
}

const sx = {
  input: { color: 'white'},
  label: { color: 'white!important' },
  fieldset: { borderColor: 'white!important' },
  '&': { width: '80%' }
}

const Home = (props: props) => {

  const [auth, setAuth] = useState(localStorage.getItem("auth") ?? "");
  const [personId, setPersonId] = useState(localStorage.getItem("personId") ?? "");
  const [teacherIDs, setteacherIDs] = useState(localStorage.getItem("teacherIDs") ?? "");

  return (
    <div>
      <Logincard 
        name="Philip"
        personid="12345"
        teacherids="12345,12345,12345"
      />
    </div>
  )
}

export default Home;


