import { faPenToSquare, faRotate } from '@fortawesome/free-solid-svg-icons'
import CSS from '../styles/newdir.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormEvent, useState } from 'react'
import Axios from 'axios'

interface UserData {
  id: string,
  email: string,
}
interface PropsTypes {
  hide: () => void,
  userData: UserData,
}

export default function NewDir({ hide, userData }: PropsTypes) {
  const [value, setValue] = useState<string>('')
  const [loadingButton, setLoadingButton] = useState<boolean>(false)

  function handleSubmit(e: FormEvent) {
    setLoadingButton(true)
    e.preventDefault()
    if (typeof (value) === 'string' && value.length >= 3 && value.length <= 15) {
      Axios.post(`${import.meta.env.VITE_SERVER_URL}/createDirectory`, { name: value, id: userData.id })
        .then((result) => {
          if (result.data.type === 1) {
            hide()
            setLoadingButton(false)
          }
        })
    }
  }

  return (
    <div className={CSS.main}>
      <div className={CSS.upperText}>Create new directory</div>
      <div className={CSS.patternText}>Name should be 3-15 characters</div>
      <form onSubmit={handleSubmit}>
        <div className={CSS.form}>
          <input required autoComplete='off' type='text' name='dirName' placeholder='Directory name' pattern='^[A-Za-z0-9]{3,15}$' maxLength={15} className={CSS.input} value={value} onChange={(e) => setValue(e.target.value)} />
          <i><FontAwesomeIcon icon={faPenToSquare} /></i>
        </div>
        <button type='submit' className={CSS.button}>{loadingButton ? <><FontAwesomeIcon icon={faRotate} spin/></>: <>CREATE DIRECTORY</>}</button>
      </form>
    </div>
  )
}
