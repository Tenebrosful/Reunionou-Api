import { ievent } from "./eventResponse";

export interface iallUsers {
  count: number,
  users: iuser[],
}

export interface iuser {
  id: string,
  username: string,
  default_event_mail: string,
  last_connexion: Date,
  createdAt: Date,
  updatedAt: Date,
}

export interface iallSelfEvents {
  count: number,
  events: Omit<ievent, "owner_id">[],
}

export interface iallJoinedEvents {
  count: number,
  events: ipartipantEvent[],
}

export interface ipartipantEvent extends ievent {
  comeToEvent: boolean
}