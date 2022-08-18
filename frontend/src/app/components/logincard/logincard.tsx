import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface props {
  name: string;
  personid: string;
  teacherids: string;
}

const sx = {
  input: { color: 'white'},
  label: { color: 'white!important' },
  fieldset: { borderColor: 'white!important' },
  '&': { width: '80%' }
}

const LoginCard = (props: props) => {

  return (
      <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personid: {props.personid} 
            <br />
            Teachers: {props.personid}

          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default LoginCard;


