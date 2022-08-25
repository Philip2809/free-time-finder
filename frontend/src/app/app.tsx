import { useEffect, useState } from "react";
import Calendar from "./pages/calendar";
import { LoginCardData } from "./helpers/interfaces";
import FirstTime from "./pages/first-time";
import Home from "./pages/home";
import './style.css'


let CalendarOrHome;

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
    localStorage.setItem('logincards', JSON.stringify(logincards));
  } , [logincards]);

  if (logincard) CalendarOrHome = <Calendar logincard={logincard} setLogincard={setLogincard} />;
  else CalendarOrHome = <Home logincards={logincards} setLogincard={setLogincard} setLogincards={setLogincards} />;

  return (
    <div> { firstTime === 'yes' ? (<FirstTime done={done} />) : CalendarOrHome } </div>
  )
}

export default App;







