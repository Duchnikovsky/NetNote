import CSS from '../styles/auth.module.css'
import FormCSS from '../styles/form.module.css'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FormEvent, useState } from 'react'

interface InputTypes {
  name: string,
  type: string,
  error: string,
  pattern: string,
  maxlenght: number,
  icon: IconProp,
}

interface Values {
  [key: string]: string,
}

export default function SignUp() {
  const [values, setValues] = useState<Values>({
    email: '',
    password: '',
    rep_password: '',
  })
  const [error, setError] = useState<String>('')
  const [result, setResult] = useState<String>('')
  const [formDisabled, setFormDisabled] = useState<Boolean>(false)

  const input: InputTypes[] = [
    {
      name: 'email',
      type: 'email',
      error: 'Email has to be valid',
      pattern: '[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+',
      maxlenght: 100,
      icon: faUser,
    },
    {
      name: 'password',
      type: 'password',
      error: 'Password should be 6-18 characters of letters and numbers',
      pattern: '^[A-Za-z0-9]{6,18}$',
      maxlenght: 18,
      icon: faKey,
    },
    {
      name: 'rep_password',
      type: 'password',
      error: 'Password should be 6-18 characters of letters and numbers',
      pattern: '^[A-Za-z0-9]{6,18}$',
      maxlenght: 18,
      icon: faKey,
    },
  ]

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value })
    setError('')
    setResult('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormDisabled(true)
    const email = values.email
    const password = values.password
    if (typeof email === 'string' && email.length > 3 && email.length <= 50 && email.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')) {
      if (typeof password === "string" && password.length >= 8 && password.length <= 18) {

      }
    }
  }

  return (
    <div className={CSS.mainS}>
      <div className={CSS.welcomeText}>
        <span className={CSS.wTBig}>Create new account</span><br></br>
        <span className={CSS.wTSmall}>Sign up to NetNote</span>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          {input.map((e: InputTypes, i: number) => (
            <div key={i} className={FormCSS.form}>
              <input required autoComplete='off' spellCheck='false' name={e.name} type={e.type} pattern={e.pattern} maxLength={e.maxlenght} className={FormCSS.input} value={values[e.name]} onChange={handleChange} placeholder=''></input>
              <i><FontAwesomeIcon icon={e.icon} /></i>
              <div className={FormCSS.error}>
                <span>{e.error}</span>
              </div>
            </div>
          ))}
          <button className={FormCSS.button} style={{ width: '140px', height: '50px' }}>SIGN IN</button>
        </form>
      </div>
    </div>
  )
}
