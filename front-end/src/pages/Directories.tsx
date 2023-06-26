import { useEffect, useRef, useState } from 'react'
import CSS from '../styles/directories.module.css'
import logo from '/netnote.png'
import Axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import NewDir from '../components/NewDir'
import Notes from '../components/Notes'
import Creator from '../components/Creator'
import Editor from '../components/Editor'

interface Props {
  redirectToAuth: () => void,
}

interface UserData {
  id: string,
  email: string,
}

interface DirectoryData {
  id: string,
  name: string,
}

interface NoteEditTypes {
  id: string,
  title: string,
  content: string,
}

export default function Directories({ redirectToAuth }: Props) {
  const [userData, setUserData] = useState<UserData>({ id: '', email: '', })
  const [directories, setDirectories] = useState<DirectoryData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(true)
  const [operation, setOperation] = useState<number>(0)
  const [selectedDir, setSelectedDir] = useState<DirectoryData>({ id: '', name: '' })
  const [selectedNote, setSelectedNote] = useState<NoteEditTypes>({ id: '', title: '', content: '' })

  function loadData() {
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/checkAuth`, {}, { withCredentials: true })
      .then((result) => {
        const data = result.data
        if (data.authenticated === true) {
          setUserData({ id: data.user.id, email: data.user.email })
          Axios.post(`${import.meta.env.VITE_SERVER_URL}/loadData`, { userId: data.user.id }, { withCredentials: true })
            .then((result) => {
              setDirectories([])
              if (result.data.type === 1) {
                result.data.directories.forEach((e: DirectoryData) => (
                  setDirectories((current) => [...current, { id: e.id, name: e.name }])
                ))
                if (result.data.directories.length === 8) {
                  setShowAdd(false)
                } else {
                  setShowAdd(true)
                }
                setLoading(false)
              }
            })
        } else {
          redirectToAuth()
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  function newDirectoryHandler() {
    setLoading(true)
    loadData()
    setOperation(0)
  }

  function selectDirectory(id: string, name: string) {
    setSelectedDir({ id: id, name: name })
    setOperation(2)
  }

  function openNewDir() {
    setSelectedDir({ id: '', name: '' })
    setOperation(1)
  }

  function openCreator() {
    setOperation(3)
  }

  function closeCreator() {
    setOperation(2)
  }

  function openEditor({ id, title, content }: NoteEditTypes) {
    setSelectedNote({ id: id, title: title, content: content })
    setOperation(4)
  }

  function removedDirectory() {
    loadData()
    setSelectedDir({ id: '', name: '' })
    setOperation(0)
  }

  return (
    <div className={CSS.main}>
      <div className={CSS.list}>
        <img src={logo} className={CSS.logo} alt="NetNote" />
        <div className={CSS.directories}>
          {loading ? <div className={CSS.loadingDiv}><FontAwesomeIcon icon={faRotate} spin /></div> :
            <>
              {
                directories.map((e: DirectoryData, index: number) => (
                  <div key={index}>
                    {(selectedDir.id === e.id ? <div className={CSS.directorySelected}>
                      {e.name}
                    </div> : <div className={CSS.directory} onClick={() => selectDirectory(e.id, e.name)}>
                      {e.name}
                    </div>)}
                  </div>
                ))
              }
              {showAdd && <div><div className={CSS.newDirectory} onClick={openNewDir}>
                <span>+</span>
              </div></div>}
            </>}
        </div>
        <hr className={CSS.hr}></hr>
        <div>
          <div className={CSS.loggedAs}>Logged as:</div>
          <div className={CSS.loggedAsName}>{userData.email}</div>
          <button className={CSS.button}>Sign out</button>
        </div>
      </div>
      {(operation === 1) && <NewDir hide={newDirectoryHandler} userData={userData} />}
      {(operation === 2) && <Notes userData={userData} directory={selectedDir} openCreator={openCreator} removedDirectory={removedDirectory} openEditor={(e: NoteEditTypes) => openEditor({ id: e.id, title: e.title, content: e.content })} />}
      {(operation === 3) && <Creator userData={userData} directory={selectedDir} closeCreator={() => closeCreator()} />}
      {(operation === 4) && <Editor note={selectedNote} closeCreator={closeCreator}/>}
    </div>
  )
}
