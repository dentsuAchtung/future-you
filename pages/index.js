import React, {useState} from "react";
import Head from "next/head";
import MakePhotoOlder from "../components/MakePhotoOlder/MakePhotoOlder";
import MakePhotoTalk from "../components/MakePhotoTalk/MakePhotoTalk";


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
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Future You</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Future you
      </h1>
      {stage === 'older' && <MakePhotoOlder onComplete={onMakePhotoOlderComplete} />}
      {stage === 'talk' && <MakePhotoTalk agedPhoto={agedPhoto} onComplete={onMakePhotoTalkComplete} />}
      {stage === 'result' && (
        <div className="w-full flex justify-center mt-5">
          <video
            src={talkingVideo}
            controls
          />
        </div>
      )}
    </div>
  );
}
