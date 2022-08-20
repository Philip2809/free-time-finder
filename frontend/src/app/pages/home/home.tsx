import { Card, CardActionArea, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import EditCardModal from "../../components/edit-card-modal";
import Logincard from "../../components/logincard";
import { LoginCardData } from "../../helpers/interfaces";
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
  const [editMode, setEditMode] = useState<boolean>(true);
  const [editCard, setEditCard] = useState<LoginCardData | null>(null);

  const handleEditClick = (card: LoginCardData) => {
    setEditCard(card);
    console.log('edit click', card);
  }

  const handleCardClick = (card: LoginCardData) => {
    console.log('card click', card);
  }

  const handleEditDone = (card: LoginCardData) => {
    console.log('edit done', card);
    setEditCard(null);
    const newLogincards = props.logincards.map(e => {
      if (e.key === card.key) return card;
      return e;
    });
    props.setLogincards(newLogincards);
  };


  return (
    <div className={styles.body}>
      
      <div className={styles.addBtn}>
      <Button variant="contained" color='success' endIcon={<MdAdd />}>
        Lägg till profil
      </Button>
      </div>

      { editCard ? (<EditCardModal close={handleEditDone} card={editCard} />) : null }

      {/* <Logincard 
        addCard={true}
        addCardText={'Lägg till Profil'}
        addCardTitle={'Lägg till Profil'}
        card={props.logincards[0]}
        handleEditClick={handleEditClick}
        handleCardClick={handleCardClick}
      /> */}
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


