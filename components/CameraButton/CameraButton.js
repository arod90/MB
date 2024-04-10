import React, { useState, useRef } from 'react';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const CameraButton = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = async (event) => {
    setIsLoading(true);
    setError(null);

    try {
      const capturedImage = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const imageAsDataURL = fileReader.result;

        if (capturedImages.length < 2) {
          setCapturedImages([...capturedImages, imageAsDataURL]);
        } else {
          uploadImages([...capturedImages, imageAsDataURL]);
        }
      };
      fileReader.readAsDataURL(capturedImage);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (images) => {
    const formData = new FormData();
    formData.append('frontID', images[0]);
    formData.append('backID', images[1]);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return response.ok;
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="h-full">
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple={true}
        onChange={handleCapture}
        className="file-input"
      />
      <button onClick={handleClick} className="custom-file-button">
        <PiIdentificationCardDuotone />
        Escanear Cedula
      </button>
    </div>
  );
};

export default CameraButton;
