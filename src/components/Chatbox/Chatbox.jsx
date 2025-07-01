import React, { useContext, useState } from 'react'
import './Chatbox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
const Chatbox = () => {

    const { userData, chatData, chatUser, setChatUser, message, messageId, setMessage, setMessageId, chatVisible, setChatVisible } = useContext(AppContext);



    const [input, setInput] = useState("");


    const sendMessage = async () => {
        try {
            if (input && messageId) {
                await updateDoc(doc(db, 'message', messageId), {
                    message: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })

                const userIds = [chatUser.rId, userData.id];
                userIds.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messageId);
                        userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
                        userChatData.chatData[chatIndex].updateAt = Date.now();
                        if (userChatData.chatData[chatIndex].rId == userData.id) {
                            userChatData.chatData[chatIndex].messageSeen = false;

                        }
                        await updateDoc(userChatsRef, {
                            chatData: userChatData.chatData
                        })
                    }
                })

            }


        } catch (error) {
            toast.error(error.message);
        }
        setInput("");
    }

    const sendImage = async (e) => {

        const file = e.target.files[0];

        // ✅ Pre-check file size before uploading
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10MB limit.");
            return;
        }
        try {
            const fileUrl = await upload(e.target.files[0]);

            if (fileUrl && messageId) {
                await updateDoc(doc(db, 'message', messageId), {
                    message: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })


                const userIds = [chatUser.rId, userData.id];
                userIds.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messageId);
                        userChatData.chatData[chatIndex].lastMessage = "image";
                        userChatData.chatData[chatIndex].updateAt = Date.now();
                        if (userChatData.chatData[chatIndex].rId == userData.id) {
                            userChatData.chatData[chatIndex].messageSeen = false;

                        }
                        await updateDoc(userChatsRef, {
                            chatData: userChatData.chatData
                        })
                    }
                })

            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const convertTimestamp = (Timestamp) => {
        let date = Timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (hour > 12) {
            if (minute < 10) {
                return hour - 12 + ":0" + minute + "PM";

            }
            else {

                return hour - 12 + ":" + minute + "PM";
            }
        }
        else {
            if (minute < 10) {
                return hour - 12 + ":0" + minute + "AM";

            }
            else {

                return hour - 12 + ":" + minute + "AM";
            }

        }
    }


    useEffect(() => {
        if (messageId) {
            const unSub = onSnapshot(doc(db, 'message', messageId), (res) => {
                setMessage(res.data().message.reverse());
                // console.log(res.data().message.reverse())
            })
            return () => {
                unSub();
            }
        }
    }, [messageId])


    return chatUser ? (
        <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt="" />
                <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null}</p>
                <img src={assets.help_icon} className='help' alt="" />
                <img onClick={() => setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
            </div>

            <div className="chat-msg">
                {message.map((msg, index) => ( // Corrected line
                    <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
                        {msg["image"]
                            ? <img className='msg-img' src={msg.image} alt="" />
                            : <p className='msg'>{msg.text}</p>
                        }
                        {/* <p className='msg'>{msg.text}</p> */}
                        <div >
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                            <p>{convertTimestamp(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>



            <div className="chat-input">
                <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Send a message" onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
                />
                <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg ' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="" />
            </div>
        </div>
    )
        :
        <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>

        </div>
}

export default Chatbox