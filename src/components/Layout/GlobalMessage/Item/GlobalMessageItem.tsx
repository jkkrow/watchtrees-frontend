import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { useTimeout } from 'hooks/timer-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { Message, uiActions } from 'store/slices/ui-slice';
import './GlobalMessageItem.scss';

interface GlobalMessageItemProps {
  message: Message;
}

const GlobalMessageItem: React.FC<GlobalMessageItemProps> = ({ message }) => {
  const [displayMessage, setDisplayMessage] = useState(false);
  const dispatch = useAppDispatch();

  const [closeTimeout] = useTimeout();

  useEffect(() => {
    if (!message) return;

    setDisplayMessage(!!message);

    if (message.timer) {
      closeTimeout(() => {
        setDisplayMessage(false);
      }, message.timer);
    }
  }, [message, closeTimeout]);

  const closeMessageHandler = () => {
    setDisplayMessage(false);
  };

  const messageExitedHandler = () => {
    dispatch(uiActions.clearMessage(message));
  };

  return (
    <CSSTransition
      in={displayMessage}
      classNames="global-message-item"
      timeout={300}
      mountOnEnter
      unmountOnExit
      onExited={messageExitedHandler}
    >
      <div
        className={`global-message-item${
          message.type === 'error' ? ' error' : ' message'
        }`}
      >
        <div className="global-message-item__body">
          <div className="global-message-item__content">{message.content}</div>
          <RemoveIcon className="btn" onClick={closeMessageHandler} />
        </div>
        {message.timer && (
          <div
            className="global-message-item__timer"
            style={{ animationDuration: `${message.timer}ms` }}
          />
        )}
      </div>
    </CSSTransition>
  );
};

export default GlobalMessageItem;