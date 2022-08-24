import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Event } from "../utils/interfaces";
import Calendar from "./pages/calendar";
import { LoginCardData } from "./helpers/interfaces";
import FirstTime from "./pages/first-time";
import Home from "./pages/home";
import Settings from "./settings";
import './style.css'



let test;


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

  if (logincard) test = <Calendar logincard={logincard} setLogincard={setLogincard} />;
  else test = <Home logincards={logincards} setLogincard={setLogincard} setLogincards={setLogincards} />;

  return (
    <div> { firstTime === 'yes' ? (<FirstTime done={done} />) : test } </div>
    // <Calendar logincard={logincards[0]} setLogincard={setLogincard} />
  )
}

export default App;







