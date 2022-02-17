import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from 'react';
import Hls from "hls.js";
import axios from "axios"

export default function Client(props) {

  return (
    <div style={{margin:"30px"}}> 
      <h2>Client Panel</h2>
      <div data-vjs-player>
      test
      </div>
    </div>
  )
}