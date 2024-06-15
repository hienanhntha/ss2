import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import testSlice from './testSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    test: testSlice,
  },
});