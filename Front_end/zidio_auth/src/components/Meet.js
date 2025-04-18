// Meet.js
import React, { useEffect, useRef } from 'react';

function Meet({ roomName, displayName }) {
  const domain = "meet.jit.si";
  const apiRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      userInfo: {
        displayName: displayName
      },
      configOverwrite: {
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false
      }
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    apiRef.current.addEventListener('readyToClose', () => {
      window.location.reload();
    });

    return () => apiRef.current?.dispose();
  }, [roomName, displayName]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999
      }}
    />
  );
}

export default Meet;
