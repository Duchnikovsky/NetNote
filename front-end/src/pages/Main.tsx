import SignIn from "../components/SignIn";
import '../App.css'
import logo from '/netnote.png'
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import Axios from 'axios'
import Directories from "./Directories";

export default function Main() {
  const [page, setPage] = useState<number>()

  useEffect(() => {
    Axios.post(`${import.meta.env.VITE_SERVER_URL}/checkAuth`, {}, { withCredentials: true })
      .then((result) => {
        const data = result.data
        if (data.authenticated === false) {
          setPage(0)
        } else if (data.authenticated === true) {
          setPage(1)
        }
      })
  }, [])

  function handleSignIn(){
    setPage(1)
  }

  function redirectToAuth(){
    setPage(0)
  }

  return (
    <div className='main'>
      {(page === 0) ? <>
        <SignIn handleSignIn={handleSignIn}/>
        <div className='center'>
          <img src={logo} className="logo" alt="NetNote" />
        </div>
        <SignUp />
      </> : <>
        <Directories redirectToAuth={redirectToAuth}/>
      </>}
    </div>
  )
}
