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

export default function AdminPanel(props) {
  const [streams, setStreams] = useState([])
  const [channel, setChannel] = useState(null)

  const getStreams = ()=>{
    axios.get(`${API_BASE_URL}:${streamPort}/api/streams`)
    .then(({ data }) => {
      var streams = data.live
      const sts = Object.keys(streams).map((stream, i)=>{
        return { name: streams[stream].publisher.stream, index:i}
      })
      setStreams(sts)
    })
    .catch((e)=>{console.log(e)}) 
  }

  useEffect(()=>{
    socket.on('switch_stream', (name)=>{
      setChannel(name)
    })
    axios.get(`${API_BASE_URL}:${apiPort}`)
    .then(({data})=>{
      setChannel(data.name)
    })
    .catch((e)=>{console.log(e)})
  }, [])

  useEffect(() => {
    socket.on('refetch', ()=>{
      getStreams()
    })
    getStreams() 
  }, [])

  const VideoStream = ({streamName, index}) => {
    useEffect(()=>{
      var video = document.getElementById(`player${index}`)
      const hls = new Hls()
      const url = `${API_BASE_URL}:${streamPort}/live/${streamName}/index.m3u8`
      hls.loadSource(url);
      hls.attachMedia(video);
    }, [])

    return <div>
        <div>Name: {streamName}</div>
        <div>Index: {index}</div>
        <video id={`player${index}`} controls style={{height:"100px", width:"180px"}}></video>
        <button onClick={()=>{
          socket.emit("switch_stream", streamName);
        }}>Set as active</button>
      </div>
  }

  return (
    <div style={{margin:"30px"}}>
      <h2>Admin Panel</h2>
      <div data-vjs-player>
      {streams.map((stream)=>{
        return <div style={{display:"inline-block", margin: "10px", border: stream.name == channel ? "5px solid red" : "1px solid black"}} key={`t${stream.index}`}>
          <VideoStream controls style={{height:"100px", width:"180px"}} streamName={stream.name} index={stream.index}/>
        </div>
      })}
      </div>
    </div>
  )
}
