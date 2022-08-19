

export interface LoginCardData {
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
