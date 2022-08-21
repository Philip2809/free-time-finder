import axios from "axios";
import { Teacher } from "./interfaces";

export function checkAuthCookie(cookie: string) {
  return new Promise<boolean | string>((resolve) => {
    axios.get(`http://localhost:5000/check-cookie/${cookie}`).then(res => {
      if (/(\$\.sc\.person\.id)([ ]?=[ ]?)([0-9]+;)/.test(res.data)) resolve(res.data);
      else resolve(false);
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
