import { useEffect, useState } from 'react';
import shaka from 'shaka-player';

import { useFirstRender } from 'hooks/cycle-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { PlayerNode, videoActions } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: PlayerNode;
}

export const usePlayer = ({ videoRef, currentVideo }: Dependencies) => {
  const activeNodeId = useAppSelector((state) => state.video.activeNodeId);
  const initialProgress = useAppSelector(
    (state) => state.video.initialProgress
  );
  const dispatch = useAppDispatch();
  const firstRender = useFirstRender();

  const [player, setPlayer] = useState<shaka.Player | null>(null);

  useEffect(() => {
    (async () => {
      if (!firstRender) return;

      const video = videoRef.current!;
      let src = currentVideo.info.url;
      let startTime: number | null = null;

      // Edit mode
      if (src.substring(0, 4) === 'blob') {
        return video.setAttribute('src', src);
      }

      src = currentVideo.info.isConverted
        ? `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${src}`
        : `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${src}`;

      // Connect video to Shaka Player
      const shakaPlayer = new shaka.Player(video);

      if (activeNodeId === currentVideo._id && initialProgress) {
        startTime = initialProgress;
      }

      await shakaPlayer.load(src, startTime);

      setPlayer(shakaPlayer);
      dispatch(videoActions.setInitialProgress(0));
    })();
  }, [
    dispatch,
    videoRef,
    currentVideo._id,
    currentVideo.info.isConverted,
    currentVideo.info.url,
    activeNodeId,
    initialProgress,
    firstRender,
  ]);

  return { player };
};