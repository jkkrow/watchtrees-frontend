import { useRef, useState } from 'react';

import CreatedVideoList from 'components/Video/Created/List/CreatedVideoList';
import UploadButton from 'components/Upload/Button/UploadButton';
import Reload from 'components/Common/UI/Reload/Reload';
import Modal from 'components/Layout/Modal/Modal';
import Input from 'components/Common/Element/Input/Input';
import { VideoTreeClient } from 'store/slices/video-slice';
import { useForm } from 'hooks/form-hook';
import { useAppThunk } from 'hooks/store-hook';
import { deleteVideo } from 'store/thunks/video-thunk';
import { VALIDATOR_EQUAL } from 'util/validators';
import 'styles/user.scss';
import { AppThunk } from 'store';

const CreatedVideoListPage: React.FC = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [targetItem, setTargetItem] = useState<VideoTreeClient | null>(null);

  const { formState, setFormInput } = useForm({
    video: { value: '', isValid: false },
  });

  const { dispatchThunk: deleteThunk, loading: deleteLoading } = useAppThunk();

  const reloadRef = useRef<ReturnType<AppThunk> | null>(null);

  const openWarningHandler = (item: VideoTreeClient) => {
    setDisplayModal(true);
    setTargetItem(item);
  };

  const closeWarningHandler = () => {
    setDisplayModal(false);
    setTargetItem(null);
  };

  const reloadHandler = () => {
    reloadRef.current && reloadRef.current();
  };

  const deleteHandler = async () => {
    if (!targetItem || !targetItem._id) return;

    await deleteThunk(deleteVideo(targetItem));

    reloadHandler();
  };

  const fetchedHandler = (fn: ReturnType<AppThunk>) => {
    reloadRef.current = fn;
  };

  return (
    <div className="videos-page">
      <Modal
        on={displayModal}
        type="form"
        header="Delete Video"
        footer="DELETE"
        loading={deleteLoading}
        invalid
        disabled={!formState.isValid}
        onConfirm={deleteHandler}
        onClose={closeWarningHandler}
      >
        <div>
          To proceed type the video name{' '}
          <strong>{targetItem?.info.title}</strong>.
        </div>
        <Input
          id="video"
          formInput
          validators={
            targetItem ? [VALIDATOR_EQUAL(targetItem.info.title)] : undefined
          }
          onForm={setFormInput}
        />
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          gap: '1rem',
        }}
      >
        <Reload onReload={reloadHandler} />
        <UploadButton />
      </div>
      <CreatedVideoList
        onDelete={openWarningHandler}
        onFetched={fetchedHandler}
      />
    </div>
  );
};

export default CreatedVideoListPage;