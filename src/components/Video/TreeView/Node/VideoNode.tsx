import VideoPlayer from '../../Player/VideoPlayer';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { useAppDispatch } from 'hooks/store-hook';
import {
  VideoNode as VideoNodeType,
  videoActions,
} from 'store/slices/video-slice';
import './VideoNode.scss';

interface VideoNodeProps {
  currentVideo: VideoNodeType;
  treeId: string;
  activeVideoId: string;
  autoPlay: boolean;
  editMode: boolean;
}

const VideoNode: React.FC<VideoNodeProps> = ({
  currentVideo,
  treeId,
  activeVideoId,
  autoPlay,
  editMode,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      {(currentVideo.id === activeVideoId ||
        currentVideo.prevId === activeVideoId) &&
        (currentVideo.info ? (
          <div
            className={`video-node${
              activeVideoId === currentVideo.id ? ' active' : ''
            }`}
          >
            <VideoPlayer
              currentVideo={currentVideo}
              treeId={treeId}
              autoPlay={autoPlay}
              editMode={editMode}
              active={activeVideoId === currentVideo.id}
            />
          </div>
        ) : (
          <div
            className={`video-node__not-found${
              activeVideoId === currentVideo.id ? ' active' : ''
            }`}
            key={currentVideo.id}
          >
            <p>Not Found</p>
            <AngleLeftIcon
              onClick={() =>
                dispatch(videoActions.setActiveVideo(currentVideo.prevId!))
              }
            />
          </div>
        ))}

      {currentVideo.children.map((video: VideoNodeType) => (
        <VideoNode
          key={video.id}
          currentVideo={video}
          treeId={treeId}
          activeVideoId={activeVideoId}
          autoPlay={false}
          editMode={editMode}
        />
      ))}
    </>
  );
};

export default VideoNode;
