import React, { useContext, useEffect } from 'react'
import './Rightsidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'


const Rightsidebar = () => {


  const { chatUser, message } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([])
  useEffect(() => {
    let tempVar = [];
    message.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    })
    // console.log(tempVar);
    setMsgImages(tempVar);
  }, [message])


  return chatUser ? (
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3> {chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <=  70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div className="">


          {msgImages.map((URL, index) => (<img onClick={() => window.open(URL)} key={index} src={URL}></img>))}
          {/* <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" /> */}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>

  )

    :
    (
      <div className="rs">
        <button onClick={() => logout()}>Logout</button>
      </div>
    )
}

export default Rightsidebar