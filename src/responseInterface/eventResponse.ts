import { iuser } from "./userResponse";

export interface iallEvents {
  count: number,
  events: ievent[],
}

export interface ievent {
  id: string,
  title: string,
  description: string,
  mail: string | null,
  date: Date,
  coords: icoords,
  owner_id: string,
  owner?: Omit<iuser,"last_connexion" | "default_event_mail"> | null,
  participants?: iparticipant[],
  createdAt: Date,
  updatedAt: Date,
}

export interface iallComments {
  count: number,
  comments: icomment[],
}

export interface icomment {
  id: string,
  event_id: string,
  author_id: string,
  message: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface iparticipant extends Omit<iuser,"last_connexion" | "default_event_mail"> {
  comeToEvent: boolean,
}

export interface icoords {
  address: string,
  lat: number,
  long: number,
}