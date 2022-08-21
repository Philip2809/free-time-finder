

export interface LoginCardData {
  key: number;
  name: string,
  personid: number,
  teacherids: number[]
  auth: string,
  teachers: Teacher[]
}

export interface Teacher {
  name: string,
  id: number
}

export interface TeacherGroup {
  id: number,
  text: string,
  color: string,
}

