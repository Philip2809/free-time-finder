import { Card, CardActionArea, CardMedia, CardContent, Typography, Backdrop, Box, Button, Fade, Modal, TextField } from "@mui/material";
import { BaseSyntheticEvent, createRef, useEffect, useState } from "react";
import { MdEdit } from 'react-icons/md';
import Select from "react-select";
import { LoginCardData, Teacher } from "../../helpers/interfaces";
import { checkAuthCookie, extractTeachersAndId } from "../../helpers/utilities";
import styles from './edit-card-modal.module.scss';

interface props {
  card: LoginCardData;
  close: (card: LoginCardData) => void;
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

  const handleClose = (event?: any, reason?: string) => {
    if (reason && ['backdropClick', 'escapeKeyDown'].includes(reason)) return;
    // const logincard: LoginCardData = {
    //   name: nameRef.current?.value || props.card.name,
    //   personid: personidRef.current?.value || props.card.personid,
    // };
    // props.closeModal();
  }

  const [name, setName] = useState<string>('');
  const [auth, setAuth] = useState<string>('');
  const [personid, setPersonid] = useState<number>(0);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherids, setTeacherids] = useState<number[]>([]);

  const [options, setOptions] = useState<Array<{ value: number, label: string }>>([]);
  const [selectedOption, setSelectedOption] = useState<Array<{ value: number, label: string }>>([]);

  const [authDisabled, setAuthDisabled] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);

  const updateTeacherList = () => {
    console.log('updateTeacherList');
    const options = teachers.map(e => {
      return { value: e.id, label: e.name };
    })
    setOptions(options);
  };

  useEffect(() => {
    if (auth.length < 5) return;
    const checkAuth = async () => {
      console.log('checkAuth', auth);
      setAuthDisabled(true);
      setAuthError(false);
      const res = await checkAuthCookie(auth);
      setAuthDisabled(false);
      if (!res) {
        setAuthError(true);
        setAuth('');
      } else if (typeof res === 'string') {
        const e = extractTeachersAndId(res);
        if (!e) {
          setAuthError(true);
          setAuth('');
        } else {
          setPersonid(e.personId);
          setTeachers(e.teachers);
        }
      }
    };
    checkAuth();
  }, [auth]);

  useEffect(() => {
    updateTeacherList();
    console.log('teachers', teachers, teacherids);
    setSelectedOption(teachers.filter(e => teacherids.includes(e.id)).map(e => {
      return { value: e.id, label: e.name };
    }));

  } , [teachers]);

  useEffect(() => {
    console.log('selectedOption', selectedOption);
    setTeacherids(selectedOption.map(e => e.value));
  } , [selectedOption]);

  useEffect(() => {
    setName(props.card.name);
    setPersonid(props.card.personid);
    setAuth(props.card.auth);
    setTeachers(props.card.teachers);
    setTeacherids(props.card.teacherids);
  }, []);

  const handleSave = () => {
    console.log('handleSave', name, auth, personid, teachers, selectedOption);
    const logincard: LoginCardData = {
      key: props.card.key,
      name, personid, auth, teachers, teacherids,
    };
    props.close(logincard);
  };

  const handleSelectChange = (sel: any) => {
    setSelectedOption(sel);
  }
  
  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <Box sx={style}>
            <div>
              <TextField
                sx={{ width: '100%', margin: '3% 0 3% 0' }}
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <hr />
            <br />
            <TextField
              sx={{ width: '100%', margin: '3% 0 3% 0' }}
              label=".SCFORMSAUTH"
              disabled={authDisabled}
              error={authError}
              color={authDisabled ? 'primary' : (authError ? 'error' : 'success')}
              focused={true}
              helperText={authError ? 'Ogiltig eller utgånget SCFORMSAUTH, vänligen hämta en ny från elevcentalen.' : ''}
              value={auth}
              onChange={(e) => setAuth(e.target.value)} />
  
            <TextField 
              sx={{ width: '100%', margin: '3% 0 3% 0' }}
              type='number'
              disabled
              label="Personid"
              value={personid} />


            <Select
              options={options}
              value={selectedOption}
              onChange={handleSelectChange}
              isMulti
              isLoading={authDisabled}
              isDisabled={authDisabled}
              placeholder='Välj lärare'
              noOptionsMessage={() => 'Ingen lärare hittad!'}
              className={styles.teacherInput} />

            <br />

            <hr />
            <Button sx={{ float: 'right' }} onClick={handleSave}>Spara</Button>
            <Button sx={{ float: 'left' }} color='error' onClick={handleClose}>Ta bort</Button>

          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default EditCardModal;
