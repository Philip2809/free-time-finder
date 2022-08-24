// // @ts-nocheck
import { LoginCardData } from "../../helpers/interfaces";
import styles from './calendar.module.scss';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  TodayButton,
  DateNavigator,
  MonthView,
  CurrentTimeIndicator,
  Resources,
  GroupingPanel,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { AppointmentModel, GroupingState, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";
import { Backdrop, CircularProgress, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CustomMonthView from "../../components/custom-calendar/month-view";
import { getAppointments, getGroupings, getLessons, randint } from "../../helpers/utilities";
import moment from "moment";
import { Item } from "../../helpers/generatedInterfaces";
// @ts-ignore
import { IntegratedAppointments } from "../../helpers/integrated-appointments";
interface props {
  logincard: LoginCardData;
  setLogincard: (logincard: LoginCardData) => void;
}

const data: AppointmentModel[] = [
  // {
  //   title: 'Website Re-Design Plan',
  //   startDate: new Date('2022-08-22 11:30'),
  //   endDate: new Date('2022-08-22 13:30'),
  //   teacher: 2,
  // }
]

let alreadyLoading = false;

const Calendar = (props: props) => {

  const [viewName, setViewName] = useState<string>('Day');
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const [earliestTime, setEarliestTime] = useState<number>(0);
  const [latestTime, setLatestTime] = useState<number>(24);

  const [events, setEvents] = useState<Item[]>([]);
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const [grouping, setGrouping] = useState<any>(
    [{
      fieldName: 'teacher',
      instances: [
        {
          text: 'Teacher 1',
          id: 1,
        }
      ]
    }]
  );

  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (alreadyLoading) return;
    const downloadLessons = async () => {
      setLoading(true);
      alreadyLoading = true;

      if (viewName === 'Day') {
        const data = await getLessons(props.logincard, new Date(viewDate).setHours(0, 0, 0, 0), new Date(viewDate).setHours(24, 0, 0, 0));
        setEvents(data.items);
      } else if (viewName === 'Week') {
        const curr = new Date(viewDate);
        const first = (curr.getDate() - curr.getDay()) + 1; // start on monday aka 1
        const last = first + 6;
        const firstDayOfWeek = new Date(curr.setDate(first)).setHours(0, 0, 0, 0);
        const lastDayOfWeek = new Date(curr.setDate(last)).setHours(24, 0, 0, 0);
        const data = await getLessons(props.logincard, firstDayOfWeek, lastDayOfWeek);
        setEvents(data.items);
      } else if (viewName === 'Month') {
        const curr = new Date(viewDate);
        const first = new Date(curr.setDate(1)).setHours(0, 0, 0, 0);
        const last = new Date(curr.setMonth(curr.getMonth() + 1)).setHours(24, 0, 0, 0);
        const data = await getLessons(props.logincard, first, last);
        setEvents(data.items);
      }

      alreadyLoading = false;
      setLoading(false);
    };
    downloadLessons();
  } , [viewDate, viewName]);

  useEffect(() => {
    events.forEach(item => {
      console.log(item.start, item.employees[0].name);
    });

    const groups = getGroupings(events);
    setGrouping([{
      fieldName: 'teacher',
      instances: groups
    }]);

    const appointments = getAppointments(events);
    setAppointments(appointments);


  }, [events])


  return (
    <div className={styles.body}>

    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>

      { // @ts-ignore // * So that I don't get errors when I use the component 
        <Scheduler
          height={'auto'}
          locale="sv-SE"
          firstDayOfWeek={1}
          data={appointments}>

          <ViewState
            currentDate={viewDate}
            onCurrentDateChange={setViewDate}
            currentViewName={viewName}
            onCurrentViewNameChange={setViewName} />

          
          {/* { grouping ? <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} /> : null} */}
          <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} /> 



          <DayView displayName="Dag" startDayHour={earliestTime} endDayHour={latestTime} />
          <WeekView displayName="Vecka" startDayHour={earliestTime} endDayHour={latestTime} />
          <CustomMonthView displayName="Månad" setViewDate={setViewDate} setViewName={setViewName} />


          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <AppointmentTooltip
            showCloseButton
          />
          <CurrentTimeIndicator shadePreviousAppointments={true} shadePreviousCells={true} />

          {/* { grouping ? <Resources data={grouping} mainResourceName='teacher' /> : null}
          { grouping ? <IntegratedGrouping /> : null}
          { grouping ? <GroupingPanel /> : null} */}


<Resources data={grouping} mainResourceName='teacher' /> 

{ grouping[0].instances.length && viewName !== 'Month' ? <IntegratedGrouping /> : null }
{ grouping[0].instances.length && viewName !== 'Month' ? <GroupingPanel /> : null }

{/* <IntegratedGrouping /> */}
{/* <GroupingPanel /> */}

          {/* <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} />
          <Resources data={grouping} mainResourceName='teacher' />
          <IntegratedGrouping />
          <GroupingPanel /> */}

<IntegratedAppointments />

        </Scheduler>

      }

    </div>
  )
}

export default Calendar;


