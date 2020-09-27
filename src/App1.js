import React, {useRef, useState} from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCfF-UVNha22sny-c-UfQKvIaGShLmPyZk",
  authDomain: "giocuo-development.firebaseapp.com",
  databaseURL: "https://giocuo-development.firebaseio.com",
  projectId: "giocuo-development",
  storageBucket: "giocuo-development.appspot.com",
  messagingSenderId: "319843907681",
  appId: "1:319843907681:web:b98115cfc110899fb41220",
  measurementId: "G-M3ZY3C5ZXX"
});


const auth = firebase.auth();
const firestore = firebase.firestore();

 /* firestore.collection("messages").add({
  title: "Boh",
  time_seconds: 45
}); */



function App(){
  const [user] = useAuthState(auth);

  return(
    <div className="App">
      <header>
      <h1>ChatRoom</h1>
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
  </div>
  );
}


function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
  <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(20);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })

    setFormValue('');
  }

  return(
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value) }/>

        <button type="submit">Go</button>
      </form>
    </>
  );
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className= {`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>);
}


export default App 
