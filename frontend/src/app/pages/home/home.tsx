import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditCardModal from "../../components/edit-card-modal";
import Logincard from "../../components/logincard";
import { LoginCardData } from "../../helpers/interfaces";
import styles from './home.module.scss';

interface props {
  logincards: LoginCardData[];
  setLogincard: (logincard: LoginCardData) => void;
}

const sx = {
  input: { color: 'white'},
  label: { color: 'white!important' },
  fieldset: { borderColor: 'white!important' },
  '&': { width: '80%' }
}

const Home = (props: props) => {

  // const [logincards, setLogincards] = useState<Array<LoginCard>>(JSON.parse(localStorage.getItem("logincards") ?? ' []') ?? []);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [editCard, setEditCard] = useState<LoginCardData | null>(null);

  const handleEditClick = (card: LoginCardData) => {
    setEditCard(card);
    setEditMode(true);
    console.log('edit click', card);
  }

  const handleCardClick = (card: LoginCardData) => {
    console.log('card click', card);
  }



  return (
    <div className={styles.body}>
      
      { editCard ? (<EditCardModal card={editCard} />) : null }

      <Logincard 
        addCard={true}
        addCardText={'Lägg till Profil'}
        addCardTitle={'Lägg till Profil'}
        card={props.logincards[0]}
        handleEditClick={handleEditClick}
        handleCardClick={handleCardClick}
      />
      <div className={styles.loginCardHolder}>
      {props.logincards.map((e: LoginCardData, i) => {
        return (
            <Logincard 
              key={i}
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


