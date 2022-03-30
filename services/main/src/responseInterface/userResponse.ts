import { ievent } from "./eventResponse";

export interface iallUsers {
  count: number,
  users: iuser[],
}

export interface iautocomplete {
  count: number,
  users: Pick<iuser, "id" | "username">[],
}

export interface iuser {
  id: string,
  username: string,
  default_event_mail?: string,
  profile_image_url: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface iallEvents {
  count: number,
  events: ipartipantEvent[],
}

export interface ipartipantEvent extends ievent {
  comeToEvent?: boolean
}