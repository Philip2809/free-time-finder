import { Card, CardActionArea, CardContent, Typography, Chip } from "@mui/material";
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
  '&': { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', resize: 'both', width: '23vw',  margin: '0.5%', height: 'fit-content' },
  '.MuiButtonBase-root': { height: 'inherit' },
}

let timer = 0;

const LoginCard = (props: props) => {

  const cardmousedown = () => {
    timer = setTimeout(() => {
      props.handleCardClick(props.card);
    }, 450);
  }

  const cardmouseup = () => {
    clearTimeout(timer);
  }

  const editclick = () => {
    props.handleEditClick(props.card);
  }

  return (
      <Card sx={sx} onMouseDown={cardmousedown} onMouseUp={cardmouseup}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{ props.addCard ? props.addCardTitle : props.card.name }</span> { props.addCard ? null : <MdEdit className={styles.editbtn} onClick={editclick} /> }
          </Typography>

            { 
              props.addCard ? (<>{props.addCardText}</>) : 
              
                (<>
              
                  <div className={styles.topChips}>
                    <Chip color='primary' label={props.card.personid} className={styles.chip} />
                  </div>

                  <div className={styles.teacherChips}>
                    { props.card.teacherids.map((n) => {
                      const teacher = props.card.teachers.find(e => e.id === n);
                      return <Chip 
                                key={n}
                                color='error'
                                title={teacher?.name}
                                label={teacher?.name}
                                className={styles.chip} />;
                    }) }
                  </div>

                  

                </>)
            }


        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default LoginCard;


