export interface iNewEvent {
  coords: {
    address: string,
    lat: number,
    long: number,
  },
  date?: Date,
  description?: string,
  owner_id?: string,
  title: string,
}