import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MdEdit } from 'react-icons/md';
import { LoginCardData } from "../../helpers/interfaces";
import styles from './logincard.module.scss';

interface props {
  addCard?: boolean;
  addCardText?: string;
  addCardTitle?: string;
  card: LoginCardData;
  handleEditClick: (card: LoginCardData) => void;
  handleCardClick: (card: LoginCardData) => void;
}

const sx = {
  '&': { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', maxWidth: 345, margin: '0.5%' },
}

const LoginCard = (props: props) => {

  const cardclick = () => {
    props.handleCardClick(props.card);
  }

  const editclick = () => {
    props.handleEditClick(props.card);
  }

  return (
      <Card sx={sx} onClick={cardclick}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{ props.addCard ? props.addCardTitle : props.card.name }</span> { props.addCard ? null : <MdEdit className={styles.editbtn} onClick={editclick} /> }
          </Typography>
          <Typography variant="body2" color="text.secondary">

            { 
              props.addCard ? (<>{props.addCardText}</>) : 
              
                (<>
              
                  <span>Personid: {props.card.personid}</span>
                  <br />
                  Teachers: {props.card.teacherids}

                </>)
            }


          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default LoginCard;


