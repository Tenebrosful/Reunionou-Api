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
}

export interface icoords {
  address: string,
  lat: number,
  long: number,
}