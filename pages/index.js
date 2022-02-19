import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import Hls from "hls.js";
import axios from "axios"
import { io } from "socket.io-client";
import Chat from "../components/chat";

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

export default function Client(props) {
  const [channel, setChannel] = useState(null)
  const [muted, setMuted] = useState(true)
  const [hls, setHls] = useState(null)

  useEffect(()=>{
    socket.on('switch_stream', (name)=>{
      setChannel(name)
    })
    axios.get(`${API_BASE_URL}:${apiPort}`)
    .then(({data})=>{
      setChannel(data.channel)
    })
    .catch((e)=>{console.log(e)})
  }, [])

  useEffect(()=>{
    if(channel){
      var video = document.getElementById(`player`)
      if(hls){
        hls.destroy()
      }
      const new_hls = new Hls()
      const url = `${API_BASE_URL}:${streamPort}/live/${channel}/index.m3u8`

      new_hls.loadSource(url);
      new_hls.attachMedia(video);
      setHls(new_hls);
    }
  }, [channel])

  return (
    <div style={{margin:"30px"}}> 
      <h2>Client Panel</h2>
      <div data-vjs-player>
          {channel?<div>
            <video id={`player`} autoPlay muted={muted} style={{height:"300px", width:"640px"}}></video>
          </div>:<div>Loading channel...</div>}
        <button onClick={()=>{setMuted(!muted)}}>{muted ? "Unmute": "Mute"}</button>
        <Chat/>
      </div>
    </div>
  )
}
