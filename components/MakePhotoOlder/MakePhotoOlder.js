import React, {useEffect, useState} from 'react';
import NextImage from "next/image";
import Loader from "../Loader/Loader";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function MakePhotoOlder({ onComplete }) {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const uploadFile = async (jsonData) => {
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
      setPrediction(prediction);
    }
  };

  function resizeImage(image, width, height) {
    // create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // draw the image onto the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    // get the resized image data from the canvas
    const resizedImage = canvas.toDataURL();

    return resizedImage;
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = (event) => {
      const img = new Image();
      img.onload = function() {
        const image = resizeImage(img, 256, 256);

        const jsonData = JSON.stringify({ image: image });
        uploadFile(jsonData);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (prediction?.output) onComplete(prediction.output)
  }, [prediction?.output, onComplete])

  return (
    <div className="text-center">
      {error && <div>{error}</div>}

      {prediction ? (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <NextImage
                fill
                src={prediction.output}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <div>
            <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
            {prediction.status !== 'processing' && <Loader />}
          </div>
        </>
      ) : (
        <>
          <p>Start by uploading your photo</p>

          <div className="w-full flex justify-center">
            <input type="file" onChange={handleFileSelect} />
          </div>
        </>
      )}
    </div>
  )
};

export default MakePhotoOlder;