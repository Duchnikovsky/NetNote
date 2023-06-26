import { useEffect, useState } from "react"
import Axios from 'axios'
import CSS from '../styles/notes.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate } from "@fortawesome/free-solid-svg-icons"

interface UserData {
  id: string,
  email: string,
}

interface DirectoryData {
  id: string,
  name: string,
}

interface PropsTypes {
  userData: UserData,
  directory: DirectoryData,
  openCreator: () => void,
  removedDirectory: () => void,
  openEditor: ({ id, title, content }: NoteEditTypes) => void,
}

interface DataTypes {
  id: string,
  usersId: string,
  directoryId: string,
  title: string,
  content: string,
  createdAt: Date,
}

interface NotesTypes {
  id: string,
  user: string,
  directory: string,
  title: string,
  content: string,
}

interface NoteEditTypes {
  id: string,
  title: string,
  content: string,
}

export default function Notes({ userData, directory, openCreator, removedDirectory, openEditor }: PropsTypes) {
  const [notes, setNotes] = useState<NotesTypes[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)

  useEffect(() => {
    setConfirmRemove(false)
    setLoading(true)
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/loadNotes`, { user: userData.id, directory: directory.id })
      .then((result) => {
        const data = result.data
        setNotes([])
        if (data.type === 1) {
          result.data.notes.forEach((e: DataTypes) => (
            setNotes((current) => [...current, { id: e.id, user: e.usersId, directory: e.directoryId, title: e.title, content: e.content }])
          ))
        } else {
          setNotes([])
        }
        setLoading(false)
      })
  }, [directory])

  function addNote() {
    openCreator()
  }

  function removeDirectory() {
    setLoadingButton(true)
    const userId = userData.id
    const directoryId = directory.id
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/removeDirectory`, { user: userId, directory: directoryId })
      .then((result) => {
        if (result.data.type === 1) {
          setLoadingButton(true)
          removedDirectory()
        }
      })
  }

  function editNote({ id, title, content }: NoteEditTypes) {
    openEditor({ id, title, content })
  }

  return (
    <div className={CSS.main}>
      {loading ? <div className={CSS.loadingDiv}><FontAwesomeIcon icon={faRotate} spin /></div> : <>
        <div className={CSS.notesGrid}>
          <div className={CSS.dataPanel}>
            <span className={CSS.dirName}>{directory.name}</span><br></br>
            <button className={CSS.button} onClick={addNote}>Add new note</button>
            {confirmRemove ? <button className={CSS.button} onClick={removeDirectory}>{loadingButton ? <><FontAwesomeIcon icon={faRotate} spin /></> : <>Confirm</>}</button> : <button className={CSS.button} onClick={() => setConfirmRemove(true)}>Remove Directory</button>}
          </div>
          {
            notes.map((e: NotesTypes, index: number) => (
              <div key={index}>
                <div className={CSS.note} onClick={() => editNote({ id: e.id, title: e.title, content: e.content })}>
                  <span className={CSS.noteTitle}>{e.title}</span>
                  <div className={CSS.noteContent}>
                    {e.content}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </>}
    </div>
  )
}
