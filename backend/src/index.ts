import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

app.get('/check-cookie/:authcookie', async (req: Request, res: Response) => {
  const authcookie = req.params.authcookie;
  const headers = {
    Cookie: `.SCFORMSAUTH=${authcookie}`
  }
  const bookingResponse = await axios.get('https://elevcentralen.se/en/Booking', { headers });
  res.send(bookingResponse.data);
});

app.get('/lessons', async (req: Request, res: Response) => {
  const auth = req.query.auth;
  const personId = req.query.personId;
  const start = req.query.start;
  const end = req.query.end;
  const teachers = req.query.teachers;

  if (!auth || !(personId && +personId) || !(start && +start) || !(end && +end) || !teachers) {    
    res.status(400).send('Bad request');
    return;
  }

  const teacherIds = (teachers as string).split(',').map((t: string) => Number(t));
  const headers = {
    Cookie: `.SCFORMSAUTH=${auth}`
  }
  const body = {
    EducationTypeId: 3,
    End: new Date(+end),
    Person: { id: +personId },
    SelectedView: 'Free',
    ShowInListView: false,
    Source: 'StudentCentral',
    Start: new Date(+start),
    TeacherIDs: teacherIds
  }

  const bookingResponse = await axios.post('https://elevcentralen.se/Booking/Home/Data', body, { headers });

  res.status(200).send(bookingResponse.data);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});