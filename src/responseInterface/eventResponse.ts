import { iuser } from "./userResponse";

export interface iallEvents {
  count: number,
  events: ievent[],
}

export interface ievent {
  id: string,
  title: string,
  description: string,
  coords: icoords,
  owner_id: string,
  participants?: iparticipant[],
}

export interface iparticipant extends Omit<iuser,"last_connexion" | "default_event_mail"> {
  comeToEvent: boolean,
}

export interface icoords {
  address: string,
  lat: number,
  long: number,
}