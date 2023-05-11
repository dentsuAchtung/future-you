import React from 'react';

const FileUpload = () => {

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    uploadFile(formData);
  };

  const uploadFile = async (formData) => {
    const response = await fetch("/api/older", {
      method: 'POST',
      body: formData
    });
    prediction = await response.json();
    if (response.status !== 200) {
      setError(prediction.detail);
      return;
    }
    console.log({ prediction });
    setPrediction(prediction);

    fetch('https://example.com/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          console.log('File uploaded successfully');
        } else {
          console.error('File upload failed');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
    </div>
  );
};

export default FileUpload;