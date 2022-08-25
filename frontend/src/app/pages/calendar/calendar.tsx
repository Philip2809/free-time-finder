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
import { AppointmentMeta, AppointmentModel, GroupingState, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";
import { Backdrop, CircularProgress, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CustomMonthView from "../../components/custom-calendar/month-view";
import { getAppointments, getGroupings, getLessons, randint } from "../../helpers/utilities";
import moment from "moment";
import { ImExit } from 'react-icons/im';
import { Item } from "../../helpers/generatedInterfaces";
// @ts-ignore
import { IntegratedAppointments } from "../../helpers/integrated-appointments";
interface props {
  logincard: LoginCardData;
  setLogincard: (logincard: LoginCardData | null) => void;
}

let appointmentMetaHowMany: AppointmentMeta | undefined;

let alreadyLoading = false;
const tempTeacherGroup =  [{
  fieldName: 'teacher',
  instances: [
    {
      text: ' ',
      id: 1,
    }
  ]
}]

const Calendar = (props: props) => {

  const [viewName, setViewName] = useState<string>('Week');
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const [earliestTime, setEarliestTime] = useState<number>(0);
  const [latestTime, setLatestTime] = useState<number>(24);

  const [events, setEvents] = useState<Item[]>([]);
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  const [grouping, setGrouping] = useState<any>(tempTeacherGroup);

  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (alreadyLoading) return;
    const downloadLessons = async () => {
      setLoading(true);
      alreadyLoading = true;
      setGrouping(tempTeacherGroup);

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
          locale="en-SE"
          firstDayOfWeek={1}
          data={appointments}>

          <ViewState
            currentDate={viewDate}
            onCurrentDateChange={setViewDate}
            currentViewName={viewName}
            onCurrentViewNameChange={setViewName} />

          
          <GroupingState grouping={[{ resourceName: 'teacher' }]} groupByDate={() => {return true}} /> 

          <DayView startDayHour={earliestTime} endDayHour={latestTime} />
          <WeekView startDayHour={earliestTime} endDayHour={latestTime} />
          <CustomMonthView setViewDate={setViewDate} setViewName={setViewName} />

          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton buttonComponent={(btnProps: TodayButton.ButtonProps) => {

            return (
              <>
                <ImExit className={styles.backBtn} onClick={ () => {
                  props.setLogincard(null)
                } } />
                <TodayButton.Button {...btnProps} />
              </>
            )

          }} />
          <Appointments />
          <AppointmentTooltip
            showCloseButton
            onVisibilityChange={(visible) => {
              if (!visible && appointmentMetaHowMany) {
                appointmentMetaHowMany.data.title = appointmentMetaHowMany.data.oldTitle;
              }
            }}
            onAppointmentMetaChange={(meta) => {
              if (meta.data?.title) {
                meta.data.oldTitle = meta.data.title;
                meta.data.title = meta.data.title?.replace(/(och \d+ till$)/, '');
              }
              appointmentMetaHowMany = meta;
            }}
          />
          <CurrentTimeIndicator shadePreviousAppointments={true} shadePreviousCells={true} />

          <Resources data={grouping} mainResourceName='teacher' /> 
          { grouping[0].instances.length && viewName !== 'Month' ? <IntegratedGrouping /> : null }
          { grouping[0].instances.length && viewName !== 'Month' ? <GroupingPanel /> : null }
          <IntegratedAppointments />

        </Scheduler>

      }

    </div>
  )
}

export default Calendar;


