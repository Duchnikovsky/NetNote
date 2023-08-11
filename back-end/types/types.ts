export interface DecodedTypes {
  authenticated: boolean,
  id: string,
  email: string,
  iat: number,
  exp: number,
}

export interface AuthTypes {
  email: string,
  password: string,
}