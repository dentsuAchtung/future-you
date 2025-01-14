import React, {useState} from "react";
import Head from "next/head";
import MakePhotoOlder from "../components/MakePhotoOlder/MakePhotoOlder";
import MakePhotoTalk from "../components/MakePhotoTalk/MakePhotoTalk";
import styles from './index.module.scss'
import Image from "next/image";
import classNames from "classnames";
import Link from "next/link";

export default function Home() {
  const [stage, setStage] = useState('older')
  const [agedPhoto, setAgedPhoto] = useState(null)
  const [talkingVideo, setTalkingVideo] = useState(null)

  function onMakePhotoOlderComplete(photo) {
    setAgedPhoto(photo)
    setStage('talk')
  }
  function onMakePhotoTalkComplete(video) {
    setTalkingVideo(video)
    setStage('result')
  }

  return (
    <div className={classNames(styles.index, "container max-w-2xl mx-auto p-7")}>
      <Head>
        <title>Future You</title>
      </Head>

      <div className={styles.background}>
        <div className={styles.left}>
          <Image src="/left.jpg" alt="left" fill />
        </div>
        <div className={styles.right}>
          <Image src="/right.jpg" alt="left" fill />
        </div>
      </div>
      <h1 className={classNames(styles.title, "py-7 text-center font-bold text-4xl")}>
        Future<br/> you
      </h1>

      <Link href="tool" className="button">Start</Link>
    </div>
  );
}
