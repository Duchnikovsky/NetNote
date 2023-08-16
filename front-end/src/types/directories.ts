export interface Directory{
  id: string,
  userId: string,
  name: string,
  createdAt: Date,
}

export interface Note{
  id: string,
  userId: string,
  directoryId: string,
  title: string,
  content: string,
  createdAt: Date,
}