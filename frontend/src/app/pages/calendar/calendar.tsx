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
} from '@devexpress/dx-react-scheduler-material-ui';
import { AppointmentModel, GroupingState, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";
import { Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CustomMonthView from "../../components/custom-calendar/month-view";
import { getGroupings, getLessons } from "../../helpers/utilities";
import moment from "moment";
import { Item } from "../../helpers/generatedInterfaces";
interface props {
  logincard: LoginCardData;
  setLogincard: (logincard: LoginCardData) => void;
}

const data: AppointmentModel[] = [
  {
    title: 'Website Re-Design Plan',
    startDate: new Date('2022-08-22 11:30'),
    endDate: new Date('2022-08-22 13:30'),
    teacher: 2,
  }
]

let alreadyLoading = false;

const Calendar = (props: props) => {

  const [viewName, setViewName] = useState<string>('Day');
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const [earliestTime, setEarliestTime] = useState<number>(9);
  const [latestTime, setLatestTime] = useState<number>(17);

  const [events, setEvents] = useState<Item[]>([]);

  const [grouping, setGrouping] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (alreadyLoading) return;
    const downloadLessons = async () => {
      setLoading(true);
      alreadyLoading = true;

      if (viewName === 'Day') {
        const data = await getLessons(props.logincard, new Date(viewDate).setHours(0, 0, 0, 0), new Date(viewDate).setHours(24, 0, 0, 0));
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
    console.log(groups);
    setGrouping([{
      fieldName: 'teacher',
      instances: groups
    }])



  }, [events])


  return (
    <div className={styles.body}>

      { loading ? <div>Loading...</div> : null }

      { // @ts-ignore // * So that I don't get errors when I use the component 
        <Scheduler
          height={'auto'}
          locale="sv-SE"
          firstDayOfWeek={1}
          data={data}>

          <ViewState
            currentDate={viewDate}
            onCurrentDateChange={setViewDate}
            currentViewName={viewName}
            onCurrentViewNameChange={setViewName} />

          
          { grouping ? <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} /> : null}



          <DayView displayName="Dag" startDayHour={earliestTime} endDayHour={latestTime} />
          <WeekView displayName="Vecka" startDayHour={earliestTime} endDayHour={latestTime} />
          {/* <CustomMonthView displayName="Månad" setViewDate={setViewDate} setViewName={setViewName} /> */}


          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <CurrentTimeIndicator shadePreviousAppointments={true} shadePreviousCells={true} />

          { grouping ? <Resources data={grouping} mainResourceName='teacher' /> : null}
          { grouping ? <IntegratedGrouping /> : null}
          { grouping ? <GroupingPanel /> : null}


          {/* <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} />
          <Resources data={grouping} mainResourceName='teacher' />
          <IntegratedGrouping />
          <GroupingPanel /> */}
        </Scheduler>

      }

    </div>
  )
}

export default Calendar;


