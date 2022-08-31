import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { FaGithub, FaHome } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import EditCardModal from "../../components/edit-card-modal";
import Logincard from "../../components/logincard";
import { LoginCardData } from "../../helpers/interfaces";
import { checkAuthCookie, randint } from "../../helpers/utilities";
import styles from './home.module.scss';

interface props {
  logincards: LoginCardData[];
  setLogincard: (logincard: LoginCardData) => void;
  setLogincards: (logincards: LoginCardData[]) => void;
}

const sx = {
  input: { color: 'white'},
  label: { color: 'white!important' },
  fieldset: { borderColor: 'white!important' },
  '&': { width: '80%' }
}

const Home = (props: props) => {
  const [editCard, setEditCard] = useState<LoginCardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEditClick = (card: LoginCardData) => {
    setEditCard(card);
  }

  const handleCardClick = async (card: LoginCardData) => {
    setLoading(true);
    const res = await checkAuthCookie(card.auth);
    setLoading(false);
    if (res && card.teacherids.length) props.setLogincard(card);
    else setEditCard(card);
  }

  const handleAddCard = () => {
    const newCard: LoginCardData = {
      key: randint(1, 7847389578347535234224324324),
      name: 'New profile',
      auth: '',
      personid: 0,
      teacherids: [],
      teachers: [],
    };
    setEditCard(newCard);
  };

  const handleEditDone = (card: LoginCardData | number) => {
    setEditCard(null);
    if (typeof card === 'number') {
      const newLogincards = props.logincards.filter((n) => n.key !== card);
      props.setLogincards(newLogincards);
      return;
    }
    if (props.logincards.length) {
      const allKeys = props.logincards.map((n) => n.key);
      if (allKeys.includes(card.key)) {
        const newLogincards = props.logincards.map((n) => {
          if (n.key === card.key) return card;
          return n;
        });
        props.setLogincards(newLogincards);
      } else {
        const newLogincards = [...props.logincards, card];
        props.setLogincards(newLogincards);
      }
    } else props.setLogincards([card]);
  };


  return (
    <div className={styles.body}>

      <div className={styles.linkIcons}>
        <div className={styles.iconHolder}>
          <a href="https://phma.dev" target='_blank'><FaHome className={styles.icon} id={styles.homeIcon} /></a>
          <a href="https://github.com/Philip2809/free-time-finder" target='_blank'><FaGithub className={styles.icon} /></a>
        </div>
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <div className={styles.addBtn}>
      <Button variant="contained" color='success' onClick={handleAddCard} endIcon={<MdAdd />}>
        Add new profile
      </Button>
      </div>

      { editCard ? (<EditCardModal close={handleEditDone} card={editCard} />) : null }

      <div className={styles.loginCardHolder}>
      {props.logincards.map((e: LoginCardData) => {
        return (
            <Logincard 
              key={e.key}
              card={e}
              handleEditClick={handleEditClick}
              handleCardClick={handleCardClick}
            />
          )
        })
      }
      </div>
    </div>
  )
}

export default Home;


