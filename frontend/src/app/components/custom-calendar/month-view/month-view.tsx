import { MonthView } from "@devexpress/dx-react-scheduler-material-ui";

interface props {
  setViewName: (viewName: string) => void;
  setViewDate: (viewDate: Date) => void;
  displayName: string;
}

const CustomMonthView = (rootProps: props) => {

  const CustomTimeTableCell = (props: MonthView.TimeTableCellProps) => {
    const dblClick = () => {
      console.log('doubleclick', props);
      rootProps.setViewName('Week')
      rootProps.setViewDate(props.startDate);
    }
    
    return (
      <MonthView.TimeTableCell {...props} onDoubleClick={dblClick} />
    )
  };

  return (
    <MonthView 
      timeTableCellComponent={CustomTimeTableCell}
      displayName={rootProps.displayName}
    />
  )
}

export default CustomMonthView;


