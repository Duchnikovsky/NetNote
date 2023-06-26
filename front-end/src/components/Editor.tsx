import { useEffect, useState } from "react"
import CSS from '../styles/creator.module.css'
import { faPenToSquare, faRotate } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Axios from 'axios'

interface NoteTypes {
  id: string,
  title: string,
  content: string,
}

interface PropsTypes {
  note: NoteTypes,
  closeCreator: () => void,
}

interface ValuesTypes {
  title: string,
  content: string,
}

export default function Editor({ note, closeCreator }: PropsTypes) {
  const [values, setValues] = useState<ValuesTypes>({
    title: '',
    content: '',
  })
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)

  function updateNote() {
    const title = values.title
    const content = values.content
    if (typeof (title) === 'string' && title.length >= 3 && title.length <= 15) {
      if (typeof (content) === 'string' && content.length > 0 && content.length < 500) {
        setLoadingButton(true)
        Axios.post(`${import.meta.env.VITE_SERVER_URL}/updateNote`, { id: note.id, title: title, content: content })
          .then((result) => {
            if (result.data.type === 1) {
              setLoadingButton(false)
              closeCreator()
            }
          })
      }
    }
  }

  useEffect(() => {
    setValues({
      title: note.title,
      content: note.content,
    })
  }, [])

  return (
    <div className={CSS.main}>
      <form className={CSS.form}>
        <input type='text' name='title' autoComplete='off' value={values.title} onChange={(e) => { setValues((values) => ({ ...values, title: e.target.value })) }} placeholder='Title of note' required pattern='^[A-Za-z0-9]{3,15}$' maxLength={15} className={CSS.input}></input>
        <i><FontAwesomeIcon icon={faPenToSquare} /></i><br></br>
        <div className={CSS.textaea}>
          <textarea placeholder='Your text here' spellCheck='false' value={values.content} onChange={(e) => { setValues((values) => ({ ...values, content: e.target.value })) }}></textarea>
        </div>
      </form>
      <div className={CSS.footer}>
        {confirmRemove ? <button className={CSS.button} onClick={closeCreator}>Confirm</button> : <button className={CSS.button} onClick={() => setConfirmRemove(true)}>Cancel </button>}
        <button className={CSS.button} onClick={updateNote}>{loadingButton ? <><FontAwesomeIcon icon={faRotate} spin /></> : <>Update note</>}</button>
      </div>
    </div>
  )
}
