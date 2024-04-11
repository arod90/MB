import React, { useState, useRef } from 'react';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const CameraButton = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleFrontCapture = async (event) => {
    setIsLoading(true);
    setError(null);

    try {
      const capturedImage = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const imageAsDataURL = fileReader.result;
        setFrontImage(imageAsDataURL);
      };
      fileReader.readAsDataURL(capturedImage);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackCapture = async (event) => {
    setIsLoading(true);
    setError(null);

    try {
      const capturedImage = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const imageAsDataURL = fileReader.result;
        setBackImage(imageAsDataURL);
      };
      fileReader.readAsDataURL(capturedImage);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async () => {
    if (!frontImage || !backImage) {
      setError('Please capture both front and back images before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('frontID', frontImage);
    formData.append('backID', backImage);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return response.ok;
  };

  return (
    <div className="h-full flex">
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <input
        ref={frontInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFrontCapture}
        className="file-input"
      />
      {frontImage && <img src={frontImage} alt="Front ID preview" />}
      <button
        onClick={() => frontInputRef.current.click()}
        className="custom-file-button"
      >
        <PiIdentificationCardDuotone />
        Escanear Cedula (Front)
      </button>
      <input
        ref={backInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleBackCapture}
        className="file-input"
      />
      {backImage && <img src={backImage} alt="Back ID preview" />}
      <button
        onClick={() => backInputRef.current.click()}
        className="custom-file-button"
      >
        <PiIdentificationCardDuotone />
        Escanear Cedula (Back)
      </button>
      <button onClick={uploadImages} className="custom-file-button">
        Upload Images
      </button>
    </div>
  );
};

export default CameraButton;
