import { Button, Modal, Box, Typography, Chip, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import Kalend, { CalendarView, CALENDAR_VIEW, OnPageChangeData, OnSelectViewData } from "kalend";
import 'kalend/dist/styles/index.css';
import { useState } from "react";
import { EventsData } from "../utils/generatedInterfaces";
import { Event, ReqData } from "../utils/interfaces";

interface props {
  e: { auth: string, pid: string, tids: string },
  spinner: (b: boolean) => void,
}

function getLessonsData(reqData: ReqData, authCookie: string): Promise<EventsData> {
  return new Promise((resolve) => {
    axios.post(`http://localhost:5000/api/getLessons/${authCookie}`, reqData)
      .then(res => {
        resolve(res.data);
      })
  });
}

function decimalToRgbString(d: number) {
  return "#" + ((d) >>> 0).toString(16).slice(-6);
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const colorFactor = getRandomInt(235234, 4785379875438);

function formatEvents(eventData: EventsData): Event[] { // thanks to quicktype this is typed
  const events: Event[] = [];

  eventData.items.forEach((item, i) => {
    let color = decimalToRgbString(item.employees[0].id * colorFactor * parseInt((item.employees[0].signature[0] || 'A'), 36));
    // might be needed
    const charsNeeded = 7 - color.length;
    for (let i = 0; i < charsNeeded; i++) color += "A";

    const event: Event = {
      id: Math.random(),
      startAt: item.start,
      endAt: item.end,
      summary: item.employees[0].name,
      color,
      fullEvent: item,
    };
    events.push(event);
  })

  return events;
}

const lessonsData: { [key: number]: Event[] } = {};

const Calendar = (props: props) => {
  const onPageChange = (data: OnPageChangeData) => {
    const startEnd: { start: string, end: string, week: number, reqData?: ReqData }[] = [];

    if (selectedView === CalendarView.WEEK) {
      const start = data.rangeFrom;
      const endDate = new Date(data.rangeFrom);
      endDate.setDate(endDate.getDate() + 7);
      const end = endDate.toISOString();
      const week = new Date(start).getWeek();
      startEnd.push({ start, end, week });
    } else if (selectedView === CalendarView.MONTH) {
      return;
      for (let i = 0; i < 6; i++) {
        const startDate = new Date(data.rangeFrom);
        startDate.setDate(startDate.getDate() + i * 7);
        const start = startDate.toISOString();

        const endDate = new Date(data.rangeFrom);
        endDate.setDate(endDate.getDate() + ((i + 1) * 7));
        const end = endDate.toISOString();

        const week = startDate.getWeek();

        startEnd.push({ start, end, week });
      }
    }

    const promises: Promise<any>[] = [];

    const sTids = props.e.tids.split(',');
    const iTids = sTids.map(e => { return +e });

    startEnd.forEach(e => {
      const reqData: ReqData = {
        Start: e.start,
        End: e.end,
        EducationTypeId: 3,
        Person: { id: +props.e.pid },
        SelectedView: "Free",
        ShowInListView: false,
        Source: "StudentCentral",
        TeacherIDs: iTids,
      };
      e.reqData = reqData;

      promises.push(getLessonsData(reqData, props.e.auth));
    });

    const weeks: any[] = [];

    props.spinner(true);
    Promise.all(promises).then(res => {
      res.forEach(async (e, i) => {
        const reqData = startEnd[i].reqData;
        let tries = 1;
        if (typeof e === "string" && reqData) {
          let res: EventsData | String = "";
          while (typeof res !== "object") {
            res = await getLessonsData(reqData, props.e.auth);
            if (tries >= 2) {
              window.location.reload();
              props.spinner(false);
              alert('One or more value is set incorrectly. Please check your inputs, most probobly its the "SCFORMSAUTH" cookie!');
            }
            tries++;
          }
          if (typeof res !== "string") weeks.push({ data: res, original: startEnd[i] });
        } else weeks.push({ data: e, original: startEnd[i] });
        console.log(res);
        if (res[0].messages.length) {
          setApiMessage(res[0].messages[0].message);
        } else setApiMessage('')
      });

      props.spinner(false);

      weeks.forEach(e => {
        const events = formatEvents(e.data);
        lessonsData[e.original.week] = events;
      });

      showLessons();
    });
  }

  function showLessons() {
    const allEvents: Event[] = [];
    Object.values(lessonsData).forEach(e => {
      allEvents.push(...e);
    });
    setEvents(allEvents);
  }

  const [events, setEvents] = useState<Event[]>([]);

  let selectedView: CALENDAR_VIEW = CalendarView.WEEK;

  const handleSelectView = (view: OnSelectViewData) => {
    selectedView = view;
  }

  const onEventClick = (data: Event) => {
    console.clear();
    console.log(data);
    if (!data.fullEvent) return;
    
    const date = new Date(data.startAt).toLocaleString('se-SV', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const timeoptions: any = { hour: 'numeric', minute: 'numeric' };
    const time = `${new Date(data.startAt).toLocaleString('se-SV', timeoptions).replace(/AM|PM| /g,'')}-${new Date(data.endAt).toLocaleString('se-SV', timeoptions).replace(/AM|PM| /g,'')}`;
    setModalInfo({
      title: data.fullEvent.title,
      teacher: data.summary,
      date,
      time,
      carType: data.fullEvent.educationTypesResourceTypes[0]?.displayName ?? 'Not specified',
    })
    openModal();
  };

  const [modalInfo, setModalInfo] = useState({
    title: '',
    teacher: '',
    date: '',
    time: '',
    carType: '',
  });

  const [openModalBool, setOpenModalBool] = useState(false);
  const openModal = () => setOpenModalBool(true);
  const handleClose = () => setOpenModalBool(false);
  
  const [apiMessage, setApiMessage] = useState('');


  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'rgb(18, 18, 18)',
    border: '2px solid #000',
    padding: 32,
    color: 'white',
  };


  return (
    <><div className="calendar-holder">
      <Kalend
        // kalendRef={props.kalendRef}
        // onNewEventClick={onNewEventClick}
        initialView={CalendarView.WEEK}
        disabledViews={[CalendarView.DAY, CalendarView.THREE_DAYS]}
        onEventClick={onEventClick}
        onSelectView={handleSelectView}
        events={events}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        showWeekNumbers={true}
        timezone={'Europe/Berlin'}
        // draggingDisabledConditions={{
        //   summary: 'Computers',
        //   allDay: false,
        //   color: 'pink',
        // }}
        // onEventDragFinish={onEventDragFinish}
        // onStateChange={props.onStateChange}
        showTimeLine={true}
        
        isDark={true}
        autoScroll={true}
        disabledDragging={true}
        focusHour={5}
        onPageChange={onPageChange} />
    </div>

      <div>
        <Modal
          open={openModalBool}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {modalInfo.title}
              <br />
              {modalInfo.teacher}
              <br />
              <Chip label={modalInfo.date} color="success"  sx={{ mr: 1 }} />
              <Chip label={modalInfo.time} color="success"  sx={{ mr: 1 }}/>
              <Chip label={modalInfo.carType} color="success"  sx={{ mr: 1 }}/>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              To get full data about this event open the console
            </Typography>
          </Box>
        </Modal>
      </div>

      <Snackbar open={apiMessage !== ''} autoHideDuration={6000}>
        <Alert severity="info" sx={{ width: '100%' }}>
          {apiMessage}
        </Alert>
      </Snackbar>
      
      </>
  )
}

export default Calendar;


