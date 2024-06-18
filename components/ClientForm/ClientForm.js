'use client';
import React, { useState, useRef } from 'react';
import { IdentificationIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';

export default function ClientForm() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [idNum, setIdNum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleCapture = async (event, setImage) => {
    setIsLoading(true);
    setError(null);

    try {
      const capturedImage = event.target.files[0];
      setImage(capturedImage);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageToApi = async (file) => {
    const base64File = await toBase64(file);
    const response = await fetch('/api/uploadId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64File.split(',')[1],
        name: file.name,
        type: file.type,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    return data.url;
  };

  const uploadImages = async () => {
    console.log('Upload images function called');
    if (!frontImage || !backImage) {
      setError('Please capture both front and back images before uploading.');
      console.error('Both images are required');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Uploading front image to API...');
      const frontImageUrl = await uploadImageToApi(frontImage);
      console.log('Front Image URL:', frontImageUrl);

      console.log('Uploading back image to API...');
      const backImageUrl = await uploadImageToApi(backImage);
      console.log('Back Image URL:', backImageUrl);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AWS_URL}usuario/image`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            front_image_url: frontImageUrl,
            back_image_url: backImageUrl,
          }),
        }
      );

      if (response.ok) {
        toast('Client registered successfully');
        console.log('Images uploaded successfully');
      } else {
        setError('Failed to upload images.');
        console.error('Failed to upload images:', response.statusText);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error during image upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadID = async () => {
    if (!idNum) {
      setError('Please enter a valid ID number.');
      return;
    }

    const formData = new FormData();
    formData.append('idNum', idNum);

    const response = await fetch('/api/uploadId', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast('Client registered successfully');
    }

    return response.ok;
  };

  return (
    <form>
      <ToastContainer />
      <div className="space-y-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Registrar Ingreso
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Escanear ambos lados de la cédula del cliente
          </p>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <div className="image-cont">
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-4 py-4 w-2/3 md:w-full lg:w-1/2">
                  <div className="text-center">
                    {frontImage ? (
                      <img
                        src={URL.createObjectURL(frontImage)}
                        className="h-28 mx-auto"
                        alt="Front ID preview"
                      />
                    ) : (
                      <IdentificationIcon
                        className=" h-28 w-28 text-gray-300 mx-auto"
                        aria-hidden="true"
                      />
                    )}
                    <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="front-upload"
                        className="relative border-2 px-3 py-1 border-indigo-600 cursor-pointer rounded-md font-semibold text-indigo-600"
                      >
                        <span>Tomar foto</span>
                        <input
                          id="front-upload"
                          name="front-upload"
                          type="file"
                          ref={frontInputRef}
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleCapture(e, setFrontImage)}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 text-md">frente de cedula</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-2/3 md:w-full lg:w-1/2">
                  <div className="text-center">
                    {backImage ? (
                      <img
                        src={URL.createObjectURL(backImage)}
                        className="h-28 mx-auto"
                        alt="Back ID preview"
                      />
                    ) : (
                      <CreditCardIcon
                        className="mx-auto h-28 w-28 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                    <div className="mt-4 flex items-center justify-center text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="back-upload"
                        className="relative border-2 px-3 py-1 border-indigo-600 cursor-pointer rounded-md font-semibold text-indigo-600"
                      >
                        <span>Tomar foto</span>
                        <input
                          id="back-upload"
                          name="back-upload"
                          ref={backInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleCapture(e, setBackImage)}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1 text-md">dorso de cedula</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-3 flex items-center justify-start gap-x-6">
          <button
            type="button"
            onClick={() => {
              setFrontImage(null), setBackImage(null);
            }}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={uploadImages}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Registrar
          </button>
        </div>
        <div className="pb-4 border-t w-1/2">
          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-2">
            Ingreso Manual
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Ingresa numero de cedula del cliente.
          </p>

          <div className="">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Numero de cedula o RUC
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="id-number"
                  id="id-number"
                  onChange={(e) => setIdNum(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  style={{
                    appearance: 'textfield',
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-start gap-x-6">
            <button
              type="button"
              onClick={uploadID}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
