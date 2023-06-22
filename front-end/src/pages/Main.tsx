import SignIn from "../components/SignIn";
import '../App.css'
import logo from '/netnote.png'
import SignUp from "../components/SignUp";

export default function Main() {
  return (
    <div className='main'>
      <SignIn />
      <div className='center'>
        <img src={logo} className="logo" alt="NetNote" />
      </div>
      <SignUp />
    </div>
  )
}
