import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import uploadReducer from './reducers/upload';
import userReducer from './reducers/user';
import videoReducer from './reducers/video';

const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    user: userReducer,
    video: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
