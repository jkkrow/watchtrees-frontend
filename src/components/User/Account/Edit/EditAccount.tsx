import EditName from './Name/EditName';
import EditPassword from './Password/EditPassword';
import EditPicture from './Picture/EditPicture';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import './EditAccount.scss';

interface EditAccountProps {
  type: 'picture' | 'name' | 'password';
  onEdit: () => void;
}

const EditAccount: React.FC<EditAccountProps> = ({ type, onEdit }) => {
  return (
    <div className="edit-account">
      <AngleLeftIcon className="edit-account__cancel btn" onClick={onEdit} />
      {type === 'name' && <EditName onSuccess={onEdit} />}
      {type === 'password' && <EditPassword onSuccess={onEdit} />}
      {type === 'picture' && <EditPicture onSuccess={onEdit} />}
    </div>
  );
};

export default EditAccount;
