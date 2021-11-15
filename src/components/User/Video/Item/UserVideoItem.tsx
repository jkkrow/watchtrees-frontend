import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import { VideoTree } from 'store/slices/video-slice';
import { formatNumber } from 'util/format';
import { thumbanilUrl, videoDuration } from 'util/video';
import './UserVideoItem.scss';

interface UserVideoItemProps {
  item: VideoTree;
  onEdit: () => void;
  onDelete: (item: VideoTree) => void;
}

const UserVideoItem: React.FC<UserVideoItemProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <li className="user-video-item">
      <div className="user-video-item__thumbnail">
        {thumbanilUrl(item) ? (
          <img src={thumbanilUrl(item)} alt={item.title} />
        ) : (
          'No Thumbnail'
        )}
      </div>
      <div className="user-video-item__info">
        <div className="user-video-item__info__title">{item.title || '_'}</div>
        <div className="user-video-item__info__tags">
          {item.tags.map((tag) => `#${tag}`).join(', ')}
        </div>
        <div className="user-video-item__info__duration">
          {videoDuration(item)}
        </div>
        <div className="user-video-item__info__views">
          Views: {formatNumber(item.views)}
        </div>
        <div className="user-video-item__info__status">
          Status: {item.status}
        </div>
        <div className="user-video-item__buttons">
          <EditIcon onClick={onEdit} />
          <DeleteIcon onClick={() => onDelete(item)} />
        </div>
      </div>
      {item.isEditing && (
        <div className="user-video-item__editing">Editing</div>
      )}
    </li>
  );
};

export default UserVideoItem;
