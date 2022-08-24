import axios from "axios";
import { Employee, EventsData, Item } from "./generatedInterfaces";
import { LoginCardData, Teacher, TeacherGroup } from "./interfaces";
import { AppointmentModel } from "@devexpress/dx-react-scheduler";


export function checkAuthCookie(cookie: string) {
  return new Promise<boolean | string>((resolve) => {
    axios.get(`http://localhost:5000/check-cookie/${cookie}`).then(res => {
      if (/(\$\.sc\.person\.id)([ ]?=[ ]?)([0-9]+;)/.test(res.data)) resolve(res.data);
      else resolve(false);
    });
  });
}

export function getLessons(card: LoginCardData, start: number, end: number) {
  return new Promise<EventsData>((resolve) => {
    const url = 'http://localhost:5000/lessons'
      + '?auth=' + card.auth
      + '&personId=' + card.personid
      + '&start=' + start
      + '&end=' + end
      + '&teachers=' + card.teacherids.join(',');

      axios.get(url).then(res => {
        resolve(res.data);
      });
  });
}

export function extractTeachersAndId(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const teacherElements = doc.getElementsByClassName('list-group-item list-group-item-sm');
  const teachers: Teacher[] = [];
  Array.from(teacherElements).forEach(e => {
      const name = e.getAttribute('data-name');
      const id = e.getAttribute('data-id');
      if (!(!name || !id)) teachers.push({ name, id: +id });
      }
  );
  const regex = html.match(/(\$\.sc\.person\.id)([ ]?=[ ]?)([0-9]+)(;)/);
  if (regex) {
    const personId = +regex[3];
    return { teachers, personId };
  }
  return false;
}

export function randint(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getGroupings(lessons: Item[]) {
  const gorupings: TeacherGroup[] = [];
  lessons.forEach(lesson => {
    const teacher = lesson.employees[0];
    if (!teacher) return;
    const group = gorupings.find(g => g.id === teacher.id);
    if (!group) {
      gorupings.push({ 
        text: teacher.name,
        id: teacher.id,
        color: getColorBasedOnTeacher(teacher),
      });
    }
  });
  return gorupings;
}

const randomNum = randint(235234, 4785379875438);

function decimalToRgbString(d: number) {
  const color = "#" + ((d) >>> 0).toString(16).slice(-6);
  if (color.length === 7) return color;
  return color + "0".repeat(7 - color.length);
}

function getColorBasedOnTeacher(teacher: Employee) {
  return decimalToRgbString(teacher.id * randomNum * parseInt((teacher.signature[0] || 'A'), 36));
}

export function getAppointments(lessons: Item[]) {
  const appointments: AppointmentModel[] = [];
  lessons.forEach(lesson => {
    const teacher = lesson.employees[0];
    if (!teacher) return;
    appointments.push({
      startDate: lesson.start,
      endDate: lesson.end,
      teacher: teacher.id,
      title: lesson.title,
    })
  });
  return appointments;
}