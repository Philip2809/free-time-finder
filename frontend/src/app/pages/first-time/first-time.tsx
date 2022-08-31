import { TextField } from '@mui/material';
import { BaseSyntheticEvent, useState } from 'react';
import FaqQuestion from '../../components/faq-question';
import { LoginCardData, Teacher } from '../../helpers/interfaces';
import { checkAuthCookie } from '../../helpers/utilities';
import styles from './first-time.module.scss';
import { FaGithub, FaHome } from 'react-icons/fa';

interface props {
  done: () => void;
}

const sx = {
  '&': { width: '100%' }
}

const FirstTime = (props: props) => {

  const handleOnInput = async (e: BaseSyntheticEvent) => {
    const input = e.target.value as string;
    if (input.length < 5) return;
    setInputDisabled(true);
    setInputError(false);
    const res = await checkAuthCookie(input);
    setInputDisabled(false);
    if (!res) {
      setInputError(true);
      e.target.value = "";
    } else if (typeof res === "string") {
      // send data to main page and contine to next page
      const parser = new DOMParser();
      const doc = parser.parseFromString(res, "text/html");
      const teacherElements = doc.getElementsByClassName('list-group-item list-group-item-sm');
      const teachers: Teacher[] = [];
      Array.from(teacherElements).forEach(e => {
        const name = e.getAttribute('data-name');
        const id = e.getAttribute('data-id');
        if (!(!name || !id)) teachers.push({ name, id: +id });
      });
      const regex = res.match(/(\$\.sc\.person\.id)([ ]?=[ ]?)([0-9]+)(;)/);
      if (regex) {
        const personId = +regex[3];
        const myFirstCard: LoginCardData = {
          key: 0,
          name: 'Profile 1',
          personid: personId,
          teacherids: [],
          auth: input,
          teachers,
        }
        
        localStorage.setItem('logincards', JSON.stringify([myFirstCard]));
        props.done();
      }
    }
  }

  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputError, setInputError] = useState(false);

  return (
    <div className={styles.body}>

      <div className={styles.linkIcons}>
        <div className={styles.iconHolder}>
          <a href="https://phma.dev" target='_blank'><FaHome className={styles.icon} id={styles.homeIcon} /></a>
          <a href="https://github.com/Philip2809/free-time-finder" target='_blank'><FaGithub className={styles.icon} /></a>
        </div>
      </div>

      <div className={styles.introBox}>
        <span id={styles.title}>Free Time Finder</span>
      </div>

      <div className={styles.introBox}>
        It looks like this is you first time here, or you recently cleared you cookies? In any case, we need to add a new profile for you!
        Please log onto <a href='https://elevcentralen.se' target='_blank'>elevcentralen.se</a> and paste the ".SCFORMSAUTH" cookie below.
        <br />
        <br />
        <a href="https://github.com/Philip2809/free-time-finder/blob/master/guides/how%20to%20get%20SCFORMSAUTH.md" target='_blank'>Where do I find the SCFORMSAUTH?</a>
        <br />
        Any Other questions? Please check out the <a href="https://github.com/Philip2809/free-time-finder" target='_blank'>github</a> page!
      </div>

      <div className={styles.introBox}>
        <TextField 
          id="outlined-basic"
          label=".SCFORMSAUTH"
          helperText={inputError ? 'Please enter a valid SCFORMSAUTH, look above to find out how to do it!' : ''}
          error={inputError}
          variant="outlined"
          disabled={inputDisabled}
          autoComplete='off'
          sx={sx}
          onInput={handleOnInput} />
      </div>
    </div>
  )
}

export default FirstTime;


