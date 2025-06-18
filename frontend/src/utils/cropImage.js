export const createImage = (url) =>
   new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (error) => reject(error));
      img.setAttribute('crossOrigin', 'anonymous'); // evitar CORS
      img.src = url;
   });

export const getCroppedImg = async (imageSrc, crop) => {
   const image = await createImage(imageSrc);
   const canvas = document.createElement('canvas');
   canvas.width = crop.width;
   canvas.height = crop.height;
   const ctx = canvas.getContext('2d');

   ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
   );

   return new Promise((resolve) => {
      canvas.toBlob((blob) => {
         resolve(blob);
      }, 'image/jpeg');
   });
};
