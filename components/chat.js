import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { io } from "socket.io-client";
// // *** http ***
// const streamPort = 7000
// // *** http ***
// const apiPort = 8080
// // *** local ***
// const API_BASE_URL = "http://localhost"

// *** https ***
const streamPort = 7080
// *** https ***
const apiPort =  8443
// *** remote ***
const API_BASE_URL = "https://teeveedrop.com"

const socket = io.connect(`${API_BASE_URL}:${apiPort}`);

export default function Chat(props){
  const [username, setUsername] = useState('')
  const [commentList, setCommentList] = useState([])

  const submitComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    socket.emit("chat", {comment, username});
    const form = document.getElementById("comment");
    form.reset();
  }

  useEffect(()=>{
    socket.on('comment', (comment)=>{
      const newList = commentList.concat(comment)
      if(newList.length>13){
        newList.shift()
      }
      setCommentList(newList)
    })
    return function(){socket.off("comment")   }
  }, [commentList])

  return (
    <div style={{backgroundColor:"white", zIndex:"10", border: "1px solid black", width:"300px", position:"absolute", left:"665px", top:"0px", display:"inline-block", margin:"30px"}}>
      <div>
        <div className="comment-container" id="commentcontainer" style={{height:"500px", overflow:"overlay", padding:"10px"}}>
          {
            commentList.map((comment, i) => {
              return (<div className="comment-bar" key={`t${i}`}>
                <p style={{overflowWrap:"anywhere"}}><span>{comment.username}: {comment.comment}</span></p>
              </div>)
            })
          }
        </div>
        {username
          ?<div>
            {username.toUpperCase()}:
            <div>
              <form id="comment" onSubmit={submitComment} className="center" style={{padding:"5px", display:"flex"}}>
                <input type="text" style={{ margin:"10px", padding:'5px', width:"100%"}} className="comment-input" name="comment" placeholder="Submit a Comment!"/><button type="submit">Submit</button>
              </form>
            </div>
          </div>
        :<form onSubmit={(e)=>{e.preventDefault(); setUsername(e.target.username.value)}}>
          <div>
            <div>Enter username to chat</div>
            <input type="text" name="username" placeholder="Reptile"/>
            <button type="submit">Submit</button>
          </div>
        </form>
        }
      </div>
    </div>
  )
}
