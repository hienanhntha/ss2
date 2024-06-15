import React from 'react';
import { useMemo } from 'react';

function AudioPlayer({src}) {
    // const audioSrc = useMemo(() => {
    //   return src;
    // }, [src]); // Replace with your actual audio source URL

     return (
    <div>
      <iframe src="https://drive.google.com/file/d/1SB2zjvROEnBiXETp3YzoWsWSn7MOI1z_/preview" width="500px" height="60px" allow="autoplay" />
    </div>
  );
}

export default AudioPlayer;
