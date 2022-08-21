import { LoginCardData } from "../../helpers/interfaces";
import styles from './calendar.module.scss';

interface props {
  logincard: LoginCardData;
  setLogincard: (logincard: LoginCardData) => void;
}


const Calendar = (props: props) => {

  return (
    <div className={styles.body}>
      {props.logincard.name}
    </div>
  )
}

export default Calendar;


