import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDoc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyD1mSv6-6kDzqGXVMINYg3Hp1Fs7u_dfQI",
  authDomain: "we-talk-8f786.firebaseapp.com",
  projectId: "we-talk-8f786",
  storageBucket: "we-talk-8f786.firebasestorage.app",
  messagingSenderId: "1050078655680",
  appId: "1:1050078655680:web:b8e7dbbbfa26ceb64fa925"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



const singup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hello world",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
    } catch (error) {
        console.error(error)
        // toast.error(error.code)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email,password) =>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login Sucessful!")
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () =>{
    try {
        await signOut(auth);

    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}


const resetPass = async (email) => {
    if(!email){
        toast.error("Enter your email");
        return null
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        }
        else{
            toast.error("Email doesn't exist")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}


export {singup,login,logout,auth,db,resetPass}
