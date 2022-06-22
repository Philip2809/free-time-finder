import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { Event } from "../utils/interfaces";
import Calendar from "./calendar";
import Settings from "./settings";
import './style.css'






const App = () => {

  const [settingsData, setSettingsData] = useState<{ auth: string, pid: string, tids: string } | null>(null);
  const [spinner, setSpinner] = useState(false);

  return (
    <div>
      {settingsData ? (

          <>
            { spinner && <div className='spinner'>
              <CircularProgress />
            </div> }
            
            <Calendar e={settingsData} spinner={setSpinner} />
          </>

        
        ) : <Settings setSettingsData={setSettingsData}/>}
    </div>
  )
}

export default App;







