import Replicate from "replicate";
import axios from 'axios'
import sharp from "sharp";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function convertFileToDataURL(fileUrl) {
  try {
    // Download the image as a Buffer
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Convert the Buffer to a base64-encoded string
    const base64String = buffer.toString('base64');

    // Create a data URL with the base64-encoded string
    const contentType = response.headers['content-type'];
    const dataUrl = `data:${contentType};base64,${base64String}`;

    return dataUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// https://replicate.delivery/pbxt/r9NwHf5NndQGW6VFteWBU5WD6at0WgHlft9sHj9KTQF7bX1hA/output.png
export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const imageResponse = await axios.get(req.body.image, { responseType: 'arraybuffer' });
  const buffer = await sharp(imageResponse.data).resize(256, 256, {
    fit: 'cover',
    position: 'center'
  }).toFormat('jpeg').toBuffer()

  // Convert the Buffer to a base64-encoded string
  const base64String = buffer.toString('base64');

  // Create a data URL with the base64-encoded string
  const contentType = imageResponse.headers['content-type'];
  const dataUrl = `data:${contentType};base64,${base64String}`;
  const image = dataUrl
  const audio = req.body.audio

  const prediction = await replicate.predictions.create({
    version: "423fe08772f8e2038f4de16e8dc80f26b5e756732445fd42061ff82d73cb1ba3",

    // This is the text prompt that will be submitted by a form on the frontend
    input: {source_image: image, driven_audio: audio},
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2500kb',
    },
  },
};