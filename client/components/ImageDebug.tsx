import React, { useState } from 'react';

const ImageDebug: React.FC = () => {
  const [imageTests] = useState([
    {
      name: 'Placeholder SVG',
      url: '/placeholder.svg',
      description: 'Local placeholder file'
    },
    {
      name: 'Unsplash T-Shirt',
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&crop=center',
      description: 'External Unsplash image'
    },
    {
      name: 'Unsplash Leggings',
      url: 'https://images.unsplash.com/photo-1506629905057-c28cac1b5ba0?w=400&h=600&fit=crop&crop=center',
      description: 'External Unsplash image'
    },
    {
      name: 'Non-existent image',
      url: '/non-existent-image.jpg',
      description: 'Should fall back to placeholder'
    }
  ]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, originalUrl: string) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/placeholder.svg') {
      console.log(`Image failed to load: ${originalUrl}, falling back to placeholder`);
      target.src = '/placeholder.svg';
    }
  };

  const handleImageLoad = (url: string) => {
    console.log(`✅ Image loaded successfully: ${url}`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px' }}>
      <h2>Image Loading Debug</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {imageTests.map((test, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 10px 0' }}>{test.name}</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>{test.description}</p>
            <div style={{ width: '180px', height: '240px', border: '1px solid #eee', overflow: 'hidden' }}>
              <img
                src={test.url}
                alt={test.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => handleImageError(e, test.url)}
                onLoad={() => handleImageLoad(test.url)}
              />
            </div>
            <p style={{ fontSize: '10px', color: '#999', margin: '5px 0 0 0', wordBreak: 'break-all' }}>
              {test.url}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDebug;
