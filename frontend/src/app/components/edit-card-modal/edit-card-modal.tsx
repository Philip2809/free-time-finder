import { Card, CardActionArea, CardMedia, CardContent, Typography, Backdrop, Box, Button, Fade, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MdEdit } from 'react-icons/md';
import Select from "react-select";
import { LoginCardData } from "../../helpers/interfaces";
import styles from './edit-card-modal.module.scss';

interface props {
  card: LoginCardData;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const EditCardModal = (props: props) => {

  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = (event?: any, reason?: string) => {
    console.log(event, reason);
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) return;
    setOpen(false);
  }

  const [options, setOptions] = useState<Array<{ value: number, label: string }>>([]);

  const teachersToOptions = () => {
    return props.card.teachers.map((e) => {
      return { value: e.id, label: e.name };
    });
  }

  useEffect(() => {
    setOptions(teachersToOptions());
  } , []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
              <TextField sx={{ width: '100%', margin: '3% 0 3% 0' }} label="Name" defaultValue={props.card.name} />
            </div>
            <hr />
            <TextField sx={{ width: '100%', margin: '3% 0 3% 0' }} type='number' label="Personid" defaultValue={props.card.personid} />
            <TextField sx={{ width: '100%', margin: '3% 0 3% 0' }} label=".SCFORMSAUTH" defaultValue={props.card.auth} />

            <Select options={options} isMulti placeholder='Välj lärare' noOptionsMessage={() => 'Ingen lärare hittad!'} className={styles.teacherInput} />


            <Button onClick={handleClose}>Ladda lärare</Button>

            <hr />
            <Button sx={{ float: 'right' }} onClick={handleClose}>Spara</Button>
            <Button sx={{ float: 'left' }} color='error' onClick={handleClose}>Ta bort</Button>

          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default EditCardModal;
