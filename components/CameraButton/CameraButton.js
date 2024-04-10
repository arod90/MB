import React, { useState } from 'react';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const CameraButton = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const captureImage = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    const track = stream.getTracks()[0];
    const imageCapture = new ImageCapture(track);
    const blob = await imageCapture.grabFrame();
    const capturedImage = await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => resolve(fileReader.result);
      fileReader.readAsDataURL(blob);
    });

    track.stop();

    return capturedImage;
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

  const handleCapture = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const capturedImage = await captureImage();

      if (capturedImages.length < 2) {
        setCapturedImages([...capturedImages, capturedImage]);
      } else {
        const success = await uploadImages(capturedImages);

        if (success) {
          alert('ID images submitted successfully!');
          setCapturedImages([]);
        } else {
          throw new Error('Failed to submit ID images.');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <button
        className="scan-button"
        onClick={handleCapture}
        disabled={isLoading}
      >
        <PiIdentificationCardDuotone />
        <span>Escanear Cedula</span>
      </button>
    </div>
  );
};

export default CameraButton;
