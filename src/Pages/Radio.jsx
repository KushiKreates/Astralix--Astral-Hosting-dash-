import React, { useEffect, useRef } from 'react';

const Radio = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src += "&autoplay=1";
    }
  }, []);

  return (
    <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        width="0"
        height="0"
        src="https://www.youtube.com/embed/McEoTIqoRKk?enablejsapi=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ border: 0 }}
      />
    </div>
  );
};

export default Radio;
