export interface iallAdmins {
  count: number,
  admins: iadmin[]
}

export interface iadmin {
  id: string,
  username: string,
  createdAt: Date,
  updatedAt: Date,
}