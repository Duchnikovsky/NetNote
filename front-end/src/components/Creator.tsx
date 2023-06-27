import { useState } from 'react'
import CSS from '../styles/creator.module.css'
import { faPenToSquare, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Axios from 'axios'

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
  closeCreator: () => void,
}

interface ValuesTypes {
  title: string,
  content: string,
}

export default function Creator({ userData, directory, closeCreator }: PropsTypes) {
  const [values, setValues] = useState<ValuesTypes>({
    title: '',
    content: '',
  })
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  
  function createNote() {
    const title = values.title
    const content = values.content
    if (typeof (title) === 'string' && title.length >= 3 && title.length <= 15) {
      if (typeof (content) === 'string' && content.length > 0 && content.length < 500) {
        setLoadingButton(true)
        Axios.post(`${import.meta.env.VITE_SERVER_URL}/createNote`, { userId: userData.id, directoryId: directory.id, title: title, content: content })
          .then((result) => {
            if (result.data.type === 1) {
              setLoadingButton(false)
              closeCreator()
            }
          })
      }
    }
  }

  return (
    <div className={CSS.main}>
      <form className={CSS.form} onSubmit={(e) => {e.preventDefault()}}>
        <input type='text' name='title' autoComplete='off' value={values.title} onChange={(e) => { setValues((values) => ({ ...values, title: e.target.value })) }} placeholder='Title of note' required pattern='^[A-Za-z0-9]{3,15}$' maxLength={15} className={CSS.input}></input>
        <i><FontAwesomeIcon icon={faPenToSquare} /></i><br></br>
        <div className={CSS.textaea}>
          <textarea placeholder='Your text here' spellCheck='false' value={values.content} onChange={(e) => { setValues((values) => ({ ...values, content: e.target.value })) }}></textarea>
        </div>
      </form>
      <div className={CSS.footer}>
        {confirmCancel ? <div className={CSS.leftFootC} onClick={closeCreator}>Confirm</div> : <div className={CSS.leftFootC} onClick={() => setConfirmCancel(true)}>Cancel</div>}
        {loadingButton ? <div className={CSS.rightFootC}><FontAwesomeIcon icon={faRotate} spin /></div> : <div className={CSS.rightFootC} onClick={createNote}>Create note</div>}
      </div>
    </div>
  )
}
