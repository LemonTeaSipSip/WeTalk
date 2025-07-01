import React, { useContext, useEffect } from 'react'
import './Chat.css'
import Leftsidebar from '../../components/Leftsidebar/Leftsidebar'
import Chatbox from '../../components/Chatbox/Chatbox'
import Rightsidebar from '../../components/Rightsidebar/Rightsidebar'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
const Chat = () => {


  const { chatData, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(chatData && userData){

      setLoading(false);
    }
  },[chatData, userData])


  return (


    <div className='chat'>


      {
        loading
          ?
          <p className='loading'>Loading...</p>
          :
          <div className="chat-container">
            <Leftsidebar />
            <Chatbox />
            <Rightsidebar />
          </div>
      }



    </div>
  )
}

export default Chat