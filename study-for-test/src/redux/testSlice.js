import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
  name: 'test',
  initialState: {},
  reducers: {
    setListTest: (state, {payload}) => {
      state.testList = payload;
    },
    setTestDetail: (state, {payload}) => {
      state.testDetail = payload;
    },
    setTestScore: (state, {payload}) => {
      state.score = payload;
    }
  },
});

export const { setListTest, setTestDetail, setTestScore } = testSlice.actions;
export default testSlice.reducer;