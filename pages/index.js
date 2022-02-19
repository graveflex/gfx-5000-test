import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import Hls from "hls.js";
import axios from "axios"
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

export default function Client(props) {
  const [channel, setChannel] = useState(null)

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

  const VideoStream = ({streamName, index}) => {
    useEffect(()=>{
      var video = document.getElementById(`player${index}`)
      const hls = new Hls()
      const url = `${API_BASE_URL}:${streamPort}/live/${streamName}/index.m3u8`
      hls.loadSource(url);
      hls.attachMedia(video);
    }, [streamName])

    return <div>
        <video id={`player${index}`} controls style={{height:"300px", width:"640px"}}></video>
      </div>
  }

  return (
    <div style={{margin:"30px"}}> 
      <h2>Client Panel</h2>
      <div data-vjs-player>
        {channel?<VideoStream streamName={channel} index={0}/>:<div>Loading channel...</div>}
      </div>
    </div>
  )
}
