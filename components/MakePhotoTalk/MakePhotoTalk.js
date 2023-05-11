import React, {useEffect, useState} from 'react';
import NextImage from "next/image";
import Loader from "../Loader/Loader";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function MakePhotoTalk({ agedPhoto, onComplete }) {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);


  const uploadFile = async (jsonData) => {
    const response = await fetch("/api/talker", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
      ) {
      await sleep(1000);
      const response = await fetch("/api/talker/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const audioReader = new FileReader();
    audioReader.onloadend = () => {
      const dataUri = audioReader.result;
      const jsonData = JSON.stringify({audio: dataUri, image: agedPhoto});
      uploadFile(jsonData);
    };
    audioReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (prediction?.output) onComplete(prediction.output)
  }, [prediction?.output, onComplete])

  return (
    <div className="text-center">
      {error && <div>{error}</div>}

      <p>Wow, you look so good when you&apos;re older!</p>
      <div className="image-wrapper mt-5">
        <NextImage
          fill
          src={agedPhoto}
          alt="output"
          sizes="100vw"
        />
      </div>

      {prediction ? (
        <div>
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
          {prediction.status === 'processing' || prediction.status === 'starting' && <Loader />}
        </div>
      ) : (

        <div className="mt-5">
          <p>Upload audio of your voice</p>

          <div className="w-full flex justify-center mt-1">
            <input type="file" onChange={handleFileSelect}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default MakePhotoTalk;