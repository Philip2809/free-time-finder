import { MonthView } from "@devexpress/dx-react-scheduler-material-ui";

interface props {
  setViewName: (viewName: string) => void;
  setViewDate: (viewDate: Date) => void;
}

const CustomMonthView = (rootProps: props) => {

  const CustomTimeTableCell = (props: MonthView.TimeTableCellProps) => {
    const dblClick = () => {
      rootProps.setViewDate(props.startDate);
      rootProps.setViewName('Day');
    }
    
    return (
        <MonthView.TimeTableCell {...props} onDoubleClick={dblClick} />
    )
  };

  return (
    <MonthView
      timeTableCellComponent={CustomTimeTableCell} />
  )
}

export default CustomMonthView;


