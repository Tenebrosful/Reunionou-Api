export interface iNewEvent {
  coords: {
    address: string,
    lat: number,
    long: number,
  },
  date?: Date,
  description?: string,
  mail?: string,
  owner_id?: string,
  title: string,
}

export interface iNewComment {
  author_id: string,
  media?: string,
  message?: string,
}