import { MonthView } from "@devexpress/dx-react-scheduler-material-ui";

interface props {
  setViewName: (viewName: string) => void;
  setViewDate: (viewDate: Date) => void;
  displayName: string;
}

const CustomMonthView = (rootProps: props) => {

  const CustomTimeTableCell = (props: MonthView.TimeTableCellProps) => {
    console.log(props);
    const dblClick = () => {
      console.log('doubleclick', props);
      rootProps.setViewName('Day');
      rootProps.setViewDate(props.startDate);
    }
    
    return (
        <MonthView.TimeTableCell {...props} onDoubleClick={dblClick} />
    )
  };

  const filterAppointments = (timeTableAppointments: any, currentView: any) => {
    console.log(timeTableAppointments);
  }  

  return (
    <MonthView
      timeTableCellComponent={CustomTimeTableCell}
      displayName={rootProps.displayName} />
  )
}

export default CustomMonthView;


