import { Item } from "../app/helpers/generatedInterfaces";


export interface Event {
  id: number;
  startAt: string;
  endAt: string;
  summary: string;
  color: string;
  fullEvent?: Item;
}

export interface ReqData {
  Source: string;
  Person: Person;
  EducationTypeId: number;
  Start: string;
  End: string;
  SelectedView: string;
  ShowInListView: boolean;
  TeacherIDs: number[];
}

export interface Person {
  id: number;
}
