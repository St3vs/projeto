import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import '../styles/ImageCropModal.css';

const ImageCropModal = ({ image, onClose, onCropComplete }) => {
   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

   const onCropCompleteHandler = useCallback((_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
   }, []);

   const handleSave = async () => {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
   };

   return (
      <div className="crop-modal" >
         <div className="crop-container" onClick={e => e.stopPropagation()}>
            <div className="crop-area">
               <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteHandler}
               />
            </div>
            <div className="crop-controls">
               <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
               />
               <div className="crop-controls-buttons">
                  <button className="save" onClick={handleSave}>Guardar</button>
                  <button className="cancel" onClick={onClose}>Cancelar</button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ImageCropModal;
