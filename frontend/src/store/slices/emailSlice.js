import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchEmailList = createAsyncThunk(
  'emails/fetchEmailList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/emails');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addEmailAddresses = createAsyncThunk(
  'emails/addEmailAddresses',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/emails', emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    emailList: [],
    selectedEmails: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectEmails: (state, action) => {
      state.selectedEmails = action.payload;
    },
    clearEmailSelection: (state) => {
      state.selectedEmails = [];
    },
    clearEmailError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmailList.fulfilled, (state, action) => {
        state.loading = false;
        state.emailList = action.payload;
        state.error = null;
      })
      .addCase(fetchEmailList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmailAddresses.fulfilled, (state, action) => {
        state.emailList = [...state.emailList, ...action.payload];
      })
      .addCase(addEmailAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add email';
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || 'An error occurred';
        }
      );
  },
});

export const { selectEmails, clearEmailSelection, clearEmailError } = emailSlice.actions;
export default emailSlice.reducer; 