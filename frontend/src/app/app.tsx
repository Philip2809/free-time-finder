import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Event } from "../utils/interfaces";
import Calendar from "./calendar";
import { LoginCardData } from "./helpers/interfaces";
import FirstTime from "./pages/first-time";
import Home from "./pages/home";
import Settings from "./settings";
import './style.css'






const App = () => {

  
  const [logincards, setLogincards] = useState<Array<LoginCardData>>(JSON.parse(localStorage.getItem("logincards") ?? ' []') ?? []);
  const [logincard, setLogincard] = useState<LoginCardData | null>(null);
  const [firstTime, setFirstTime] = useState(localStorage.getItem('firsttime') ?? 'yes');

  const done = () => {
    localStorage.setItem('firsttime', 'no');
    setLogincards(JSON.parse(localStorage.getItem("logincards") ?? ' []') ?? []);
    setFirstTime('no');
  }

  useEffect(() => {
    console.log('logincards', logincards);
    localStorage.setItem('logincards', JSON.stringify(logincards));
  } , [logincards]);

  return (
    <div>
      { firstTime === 'yes' ? (<FirstTime done={done} />) : (<Home logincards={logincards} setLogincard={setLogincard} setLogincards={setLogincards} />) }
    </div>
  )
}

export default App;







