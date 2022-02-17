import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import Hls from "hls.js";
import axios from "axios"

export default function AdminPanel(props) {
  const [streams, setStreams] = useState([])

  useEffect(() => {
    axios.get("http://64.227.30.198:8000/api/streams")
    .then(({ data }) => {
      var streams = data.live
      const sts = Object.keys(streams).map((stream, i)=>{
        return { name: streams[stream].publisher.stream, index:i}
      })
      setStreams(sts)
    })
  }, [])

  const VideoStream = ({name, index}) => {
    useEffect(()=>{
      var video = document.getElementById(`player${index}`)
      const hls = new Hls()
      const url = `http://64.227.30.198:8000/live/${name}/index.m3u8`
      hls.loadSource(url);
      hls.attachMedia(video);
    }, [])
    return <div>
        <div>Static Stream {index}</div>
        <video id={`player${index}`} controls style={{height:"100px", width:"180px"}}></video>
        <button>Set as active</button>
      </div>
  }

  return (
    <div style={{margin:"30px"}}>
      <h2>Admin Panel</h2>
      <div data-vjs-player>
      {streams.map((stream)=>{
        return <div style={{display:"inline-block", margin: "10px"}} key={`t${stream.index}`}>
          <div>{stream.name}</div>
          <VideoStream controls style={{height:"100px", width:"180px"}} name={stream.name} index={stream.index}/>
        </div>
      })}
      </div>
    </div>
  )
}