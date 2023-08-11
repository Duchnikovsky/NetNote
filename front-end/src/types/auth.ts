export interface Session{
  authenticated: boolean,
}

export interface InputTypes {
  name: string;
  type: string;
  pattern: string;
  maxlenght: number;
  icon: JSX.Element;
}