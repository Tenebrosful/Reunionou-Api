import { iuser } from "./userResponse";

export interface ievent {
  id: string,
  title: string,
  description: string,
  coords: icoords,
  owner_id: string,
}

export interface icoords {
  address: string,
  lat: number,
  long: number,
}