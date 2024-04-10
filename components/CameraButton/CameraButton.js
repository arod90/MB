import React, { useRef } from 'react';
import { PiIdentificationCardDuotone } from 'react-icons/pi';

const CameraButton = () => {
  const inputRef = useRef(null);

  // Handle the file input change
  const handleCapture = async (event) => {
    const files = event.target.files;
    if (files.length === 2) {
      // Ensure exactly two images are captured
      const formData = new FormData();
      formData.append('frontID', files[0]);
      formData.append('backID', files[1]);

      // Send the images to the server immediately after capturing
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('ID images submitted successfully!');
      } else {
        alert('Failed to submit ID images.');
      }

      // Reset the input after processing
      inputRef.current.value = '';
    } else {
      alert('Please capture both the front and back sides of the ID.');
    }
  };

  return (
    <div className="h-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        multiple
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <button className="scan-button">
          <PiIdentificationCardDuotone />
          <span>Escanear Cedula</span>
        </button>
      </label>
    </div>
  );
};

export default CameraButton;
