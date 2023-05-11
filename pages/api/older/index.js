import Replicate from "replicate";
import multer from 'multer';
import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    version: "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",

    // This is the text prompt that will be submitted by a form on the frontend
    input: {image: req.body.image, target_age: '45'},
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
