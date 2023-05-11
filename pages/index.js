import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import FileUpload from "../components/FileUpload/FileUpload";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const uploadFile = async (jsonData) => {
    console.log(jsonData);
    const response = await fetch("/api/older", {
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
      const response = await fetch("/api/older/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUri = reader.result;
      const jsonData = JSON.stringify({ image: dataUri });
      uploadFile(jsonData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Future You</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Future you
      </h1>

      {error && <div>{error}</div>}

      {prediction ? (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      ) : (
        <>

          <p>Start by uploading your photo</p>

          <div className="w-full flex">
            <input type="file" onChange={handleFileSelect} />
          </div>
        </>
      )}
    </div>
  );
}
