import Form from 'components/Common/Element/Form/Form';
import Input from 'components/Common/Element/Input/Input';
import Button from 'components/Common/Element/Button/Button';
import { useForm } from 'hooks/form-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { updateUserName } from 'store/thunks/user-thunk';
import { VALIDATOR_MINLENGTH } from 'util/validators';
import './EditName.scss';

interface EditNameProps {
  onSuccess: () => void;
}

const EditName: React.FC<EditNameProps> = ({ onSuccess }) => {
  const { userData, loading } = useAppSelector((state) => state.user);
  const { dispatch } = useAppDispatch();

  const { formState, setFormInput } = useForm({ name: '' });

  const submitHandler = async () => {
    if (!formState.isValid) return;

    const newName = formState.inputs.name.value;

    if (newName === userData!.name) return;

    await dispatch(updateUserName(formState.inputs.name.value));

    onSuccess();
  };

  return (
    <Form onSubmit={submitHandler}>
      <Input
        id="name"
        formInput
        label="Name *"
        initialValue={userData!.name}
        message="At least 4 characters"
        validators={[VALIDATOR_MINLENGTH(4)]}
        onForm={setFormInput}
      />
      <Button
        disabled={formState.inputs.name.value === userData!.name}
        loading={loading}
      >
        Change Name
      </Button>
    </Form>
  );
};

export default EditName;
