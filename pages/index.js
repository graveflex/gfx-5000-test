import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import Hls from "hls.js";
import axios from "axios"
import { io } from "socket.io-client";
const API_BASE_URL = "http://64.227.30.198"
const socket = io(API_BASE_URL);

export default function Client(props) {
  const [channel, setChannel] = useState(null)

  useEffect(()=>{
    socket.on('switch_stream', (name)=>{
      setChannel(name)
    })
    axios.get("http://64.227.30.198:3000")
    .then(({data})=>{
      setChannel(data.name)
    })
    .catch((e)=>{console.log(e)})
  }, [])

  const VideoStream = ({streamName, index}) => {
    useEffect(()=>{
      var video = document.getElementById(`player${index}`)
      const hls = new Hls()
      const url = `API_BASE_URL:8000/live/${streamName}/index.m3u8`
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