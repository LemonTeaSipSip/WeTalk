import React, { Fragment, useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Profileupdate from './pages/Profileupdate/Profileupdate'
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'


const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)
  useEffect (() =>{
    onAuthStateChanged(auth, async (user) => {
        if(user){
          navigate('/chat')
          // console.log(user)
          await loadUserData(user.uid)
        }
        else{
          navigate('/')
        }
    })
  },[])

  return (
    <>
    <ToastContainer/>
    <Routes>

      <Route path='/' element={<Login/>}/> 
      {/* when ever the user will open the app it will see this page  */}

      <Route path='/chat' element={<Chat/>}/> 
      {/* to open the chat page  */}

      <Route path='/profile' element={<Profileupdate/>}/> 
      {/* to open the ProfileUpdate page  */}

    </Routes>
    </>
  )
}

export default App