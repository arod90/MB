import React, { useRef, useState } from 'react';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const CameraButton = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;
      video.srcObject = stream;
      video.play();

      video.onclick = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const capturedImage = canvas.toDataURL('image/png');

        if (capturedImages.length < 2) {
          setCapturedImages([...capturedImages, capturedImage]);
        } else {
          const formData = new FormData();
          formData.append('frontID', capturedImages[0].split(',')[1]);
          formData.append('backID', capturedImages[1].split(',')[1]);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            alert('ID images submitted successfully!');
            setCapturedImages([]);
          } else {
            alert('Failed to submit ID images.');
          }
        }
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className="h-full">
      <video ref={videoRef} style={{ display: 'none' }} />
      <button className="scan-button" onClick={handleCapture}>
        <PiIdentificationCardDuotone />
        <span>Escanear Cedula</span>
      </button>
    </div>
  );
};

export default CameraButton;
