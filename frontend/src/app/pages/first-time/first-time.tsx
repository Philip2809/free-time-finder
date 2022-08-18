import { TextField } from '@mui/material';
import { BaseSyntheticEvent, useState } from 'react';
import FaqQuestion from '../../components/faq-question';
import { checkAuthCookie } from '../../helpers/utilities';
import styles from './first-time.module.scss';

const sx = {
  '&': { width: '100%' }
}

const FirstTime = () => {

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
      const teachers = Array.from(teacherElements).map(e => {
        return { 
          name: e.getAttribute('data-name'),  
          id: e.getAttribute('data-id'),  
        }
      });
      console.log(teachers);
    }
  }

  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputError, setInputError] = useState(false);

  return (
    <div className={styles.body}>

      <div className={styles.introBox}>
        <span id={styles.title}>Free Time Finder</span>
      </div>

      <div className={styles.introBox}>
        Det verkar som att detta är första gången du är på sidan eller kanske du har rensat dina kakor? Oavsätt fall vi "omkonfigrera"
        och till detta behövs att du loggar in på elevcentalen och och klistrar in ".SCFORMSAUTH" kakan nedanför.
      </div>

      <div className={styles.introBox}>
        <TextField id="outlined-basic" label=".SCFORMSAUTH" error={inputError} variant="outlined" disabled={inputDisabled} autoComplete='off' sx={sx} onInput={handleOnInput} />
      </div>

      <div className={styles.introBox} id={styles.faq}>
       Vanliga frågor
       <div id={styles.faqContent}>
       <br />
        <FaqQuestion 
          question='Vad gör Free Time Finder?'
          answer='Free Time Finder gör det lättare att hitta lediga körlektionstider som man annars hade behövt boka genom Elevcentalen. 
          Elevcentalens system är mycket dålig, då man endast kan se en lärare åt gången samt endast en mycket begränsad veckovy. 
          OSB! Free Time Finder är endast gjort för att hitta en ledig tid, du måste själv gå in på elevcentalen för att boka den!'/>

        <br />

        <FaqQuestion 
          question='Var hittar jag ".SCFORMSAUTH" kakan?'
          answer='Det kan vara lite svårt att hitta kakan, därför finns det guider här hur man kan hitta de på olika enheter:
          Dator, Mobil (länk)'/>

        <br />

        <FaqQuestion 
          question='Är Free Time Finder säkert?'
          answer='SCFORMSAUTH kakan gör just det den låter som, den autentiserar dig på Elevcentalen, detta är helt enkelt ett login för datorer.
          För att säkerställa transparens för säkerhet så ligger all kod ute på github (länk) samt dokumentation om du själv vill köra projektet
          på en egen dator. Alla data som laddas ner via Elevcentralen sparas endast på din dator, i localstorage. Det är därför du kanske ser 
          denna sidan igen efter att du rensat dina kakor. '/>
       </div>
      </div>

    </div>
  )
}

export default FirstTime;


