import VideoList from 'components/Video/List/VideoList';
import { fetchHistory } from 'store/thunks/video-thunk';

const HistoryPage: React.FC = () => {
  return (
    <div className="layout">
      <VideoList
        id="history"
        label="Watch History"
        forceUpdate
        onFetch={fetchHistory}
      />
    </div>
  );
};

export default HistoryPage;