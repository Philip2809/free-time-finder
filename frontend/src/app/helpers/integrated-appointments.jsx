import * as React from "react";
import { Plugin, Getter } from "@devexpress/dx-react-core";

const pluginDependencies = [
  { name: "MonthView" },
  { name: "IntegratedGrouping", optional: "true" }
];

const maxBoundaryPredicate = (maxBoundary, startDate) =>
  maxBoundary.isBefore(startDate, "day") ||
  (isMidnight(maxBoundary) && maxBoundary.isSame(startDate, "day"));

const byDayPredicate = (boundary, date) =>
  boundary.isSameOrAfter(date, "day") &&
  !boundary.isSame(boundary.clone().startOf("day"));

const isMidnight = date => date.isSame(date.clone().startOf("day"));

const compareByDay = (first, second) => {
  if (first.start.isBefore(second.start, "day")) return -1;
  if (first.start.isAfter(second.start, "day")) return 1;
  return 0;
};

const compareByAllDay = (first, second) => {
  if (first.allDay && !second.allDay) return -1;
  if (!first.allDay && second.allDay) return 1;
  return 0;
};

const compareByTime = (first, second) => {
  if (first.start.isBefore(second.start)) return -1;
  if (first.start.isAfter(second.start)) return 1;
  if (first.end.isBefore(second.end)) return 1;
  if (first.end.isAfter(second.end)) return -1;
  return 0;
};

export const sortAppointments = appointments =>
  appointments
    .slice()
    .sort(
      (a, b) =>
        compareByDay(a, b) || compareByAllDay(a, b) || compareByTime(a, b)
    );

export const findOverlappingAppointments = (
  sortedAppointments,
  byDay = false
) => {
  const appointments = sortedAppointments.slice();
  const groups = [];
  let totalIndex = 0;

  while (totalIndex < appointments.length) {
    groups.push([]);
    const current = appointments[totalIndex];
    const currentGroup = groups[groups.length - 1];
    let next = appointments[totalIndex + 1];
    let maxBoundary = current.end;

    currentGroup.push(current);
    totalIndex += 1;
    while (
      next &&
      (maxBoundary.isAfter(next.start) ||
        (byDay && byDayPredicate(maxBoundary, next.start)))
    ) {
      currentGroup.push(next);
      if (maxBoundary.isBefore(next.end)) maxBoundary = next.end;
      totalIndex += 1;
      next = appointments[totalIndex];
    }
  }
  return groups;
};

export const adjustAppointments = (groups, byDay = false) =>
  groups.reduce((acc, items) => {
    let offset = 0;
    const appointments = items.map(appointment => ({ ...appointment }));
    const groupLength = appointments.length;
    for (let startIndex = 0; startIndex < groupLength; startIndex += 1) {
      const appointment = appointments[startIndex];
      if (appointment.offset === undefined) {
        let maxBoundary = appointment.end;
        appointment.offset = offset;
        for (let index = startIndex + 1; index < groupLength; index += 1) {
          if (appointments[index].offset === undefined) {
            if (
              (!byDay &&
                maxBoundary.isSameOrBefore(appointments[index].start)) ||
              (byDay &&
                maxBoundaryPredicate(maxBoundary, appointments[index].start))
            ) {
              maxBoundary = appointments[index].end;
              appointments[index].offset = offset;
            }
          }
        }

        offset += 1;
      }
    }
    const nr3 = appointments.find(appointment => appointment.offset === 2);
    if (nr3 && groupLength > 3) nr3.dataItem.title += ` and ${groupLength - 3} more`;
    return [...acc, ...appointments];
  }, []);

const filterAppointments = ({ timeTableAppointments, currentView }) => {
  if (currentView.type !== "month") {
    return timeTableAppointments;
  }
  const sortedAppointments = timeTableAppointments.map(sortAppointments);
  const groupedAppointments = sortedAppointments.map(sortedGroup =>
    findOverlappingAppointments(sortedGroup, true)
  );
  const adjustedAppointments = groupedAppointments.map(group =>
    adjustAppointments(group, true)
  );
  const filteredAppointments = adjustedAppointments.map(appointments =>
    appointments.filter(appointment => appointment.offset < 3)
  );
  return filteredAppointments.map(appointmentGroup =>
    appointmentGroup.map(({ offset, ...restProps }) => ({ ...restProps }))
  );
};

export const IntegratedAppointments = () => {
  return (
    <Plugin name="IntegratedAppointments" dependencies={pluginDependencies}>
      <Getter name="timeTableAppointments" computed={filterAppointments} />
    </Plugin>
  );
};
