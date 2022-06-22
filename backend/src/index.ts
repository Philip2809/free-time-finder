import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const app: Express = express();
const port = 5000;

app.use(express.json());
app.use(cors())


app.post('/api/getLessons/:authcookie', async (req: Request, res: Response) => {
  const authcookie = req.params.authcookie;
  const headers = {
    Cookie: `.SCFORMSAUTH=${authcookie}`
  }
  const bookingResponse = await axios.post('https://elevcentralen.se/Booking/Home/Data', req.body, { headers });
  res.send(bookingResponse.data);
});

app.use('/', express.static('frontend-build'));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});