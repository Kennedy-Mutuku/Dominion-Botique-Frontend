import React, { useEffect, useRef } from 'react';

const VideoBackground = () => {
  const videoId = '7m16dFI1AF8';
  const startTime = 12; // Start after the logo fades
  const endTime = 65;   // End before the logo grid starts
  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    }

    function createPlayer() {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          start: startTime,
          end: endTime,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            // When video ends (or reaches 'end' time), loop back to startTime
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime);
              event.target.playVideo();
            }
          }
        }
      });
    }

    // Polling fallback to ensure it loops exactly at endTime even if 'ENDED' state isn't triggered perfectly
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= endTime) {
          playerRef.current.seekTo(startTime);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div 
        id="youtube-player" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000"
        style={{
          width: '120vw',
          height: '67.5vw', /* 16:9 at 120% */
          minHeight: '120vh',
          minWidth: '213.33vh', /* 120 * 1.777 */
        }}
      />
      <div className="absolute inset-0 video-overlay z-10" />
    </div>
  );
};

export default VideoBackground;
