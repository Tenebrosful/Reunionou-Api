export interface iAllUserAccount {
  count: number,
  userAccounts: iUserAccount[],
}

export interface iUserAccount {
  id: string,
  login: string,
  isAdmin: boolean,
  last_connexion: Date,
  createdAt: Date,
  updatedAt: Date,
}