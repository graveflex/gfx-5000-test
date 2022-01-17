import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect} from 'react';
import Hls from "hls.js";

export default function Home(props) {
  useEffect(() => {
    var video = document.getElementById("player1")
    const hls = new Hls()
    const url = "http://64.227.30.198:8000/live/stream/index.m3u8"
    hls.loadSource(url);
    hls.attachMedia(video);
  }, [])

  useEffect(() => {
    // broadcast to
    // rtmp://64.227.30.198:1935/live/obs
    var video = document.getElementById("player2")
    const hls = new Hls()
    const url = "http://64.227.30.198:8000/live/obs/index.m3u8"
    hls.loadSource(url);
    hls.attachMedia(video);
  }, [])


  return (
    <div style={{margin:"30px"}}> 
      <h2>GRAVEFLEX 5000 TEST</h2>
      <div data-vjs-player>
        <br/>
        <div>Static Video Stream</div>
        <br/>
        <video id="player1" controls style={{height:"400px", width:"740px"}}></video>
        <br/><br/><br/>
        <div>Video Broadcast Stream</div>
        <br/><br/>
        <video id="player2" controls style={{height:"400px", width:"740px"}}></video>
      </div>
    </div>
  )
}