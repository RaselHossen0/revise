import React, { useEffect, useState } from 'react';
import { getFile } from '../../apis/api'; // Import your API function to fetch image

const ImageViewer = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getFile(imageUrl); // Replace with your API call to fetch image
        const blob = new Blob([response.data], { type: 'image/png' }); // Assuming response.data contains the binary image data
        const objectURL = URL.createObjectURL(blob);
        setImageSrc(objectURL);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();

    // Clean up by revoking the object URL when component unmounts or when no longer needed
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageUrl]); // Make sure to pass imageUrl in the dependency array if it changes

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt="Fetched Image" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImageViewer;
