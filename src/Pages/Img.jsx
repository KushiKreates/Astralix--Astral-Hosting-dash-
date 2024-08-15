import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const coins = userData.coins || [];

            // Set the images and their corresponding texts
            setImages([
              {
                id: 1,
                url: 'https://cdn.discordapp.com/attachments/1271869142332477612/1272835781446209577/2024-present_Astral_Axis_2.png?ex=66bc6c32&is=66bb1ab2&hm=cb212c782d22d5a079e2cf635ef9b004a70074c2a6de2676e835a462cc0737d8&',
                text: 'Astral Axis'
              },
              {
                id: 2,
                url: 'https://cdn.discordapp.com/attachments/1271869142332477612/1272835829571518535/pREMIUM_EGGS_1.png?ex=66bc6c3d&is=66bb1abd&hm=e46904d665f5d3cee1ad909f7e25f99d868eb12009e33e8bb11e42c5fcf55cb6&',
                text: 'Premium Eggs'
              }
            ]);
          } else {
            setError('User document does not exist');
          }
        } else {
          setError('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No images found</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 border rounded-lg shadow-lg">
      {images.map(image => (
        <div key={image.id} className="mb-6 text-center">
          <img
            src={image.url}
            alt={image.text}
            style={{ width: '400px', height: '600px', objectFit: 'cover' }}
            className="mx-auto rounded-lg shadow-md"
          />
          <p className="mt-2 text-xl font-semibold">{image.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
