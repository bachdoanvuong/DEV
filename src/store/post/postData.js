import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cvImg: '',
  title: '',
  tags: [],
  MDEValue: '',
  docs: [], // New state for storing docs
};

const PostDataSlice = createSlice({
  name: 'postData',
  initialState,
  reducers: {
    setTitleToStore: (state, action) => {
      state.title = action.payload;
    },

    setCvImgToStore: (state, action) => {
      state.cvImg = action.payload;
    },

    setTagsToStore: (state, action) => {
      state.tags = action.payload;
    },

    setMDEValueToStore: (state, action) => {
      state.MDEValue = action.payload;
    },

    addDocumentToStore: (state, action) => {
      state.docs.push(action.payload); // Add a document to the state
    },

    removeDocumentFromStore: (state, action) => {
      state.docs = state.docs.filter(
        (doc) => doc.url !== action.payload
      ); // Remove a document from the state
    },
  },
});

export const {
  setCvImgToStore,
  setTitleToStore,
  setTagsToStore,
  setMDEValueToStore,
  addDocumentToStore,
  removeDocumentFromStore,
} = PostDataSlice.actions;

export default PostDataSlice.reducer;
