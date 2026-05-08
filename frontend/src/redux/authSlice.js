import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Login failed');
        }
    }
);

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Signup failed');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Verification failed');
        }
    }
);

export const resendOtp = createAsyncThunk(
    'auth/resendOtp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/resend-otp', { email });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
        }
    }
);


export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            return response.data; // returns { data: { user, school } }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to sync status');
        }
    }
);

export const updateSchool = createAsyncThunk(
    'auth/updateSchool',
    async (schoolData, { rejectWithValue }) => {
        try {
            const response = await api.patch('/ui/school', schoolData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update school details');
        }
    }
);

const initialState = {
    user: null,
    accessToken: null,
    school: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.school = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            // Also call backend logout
            api.post('/auth/logout').catch(console.error);
        },
        clearError: (state) => {
            state.error = null;
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        updateUserInfo: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.accessToken = action.payload.accessToken;
                state.school = action.payload.data.school;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : action.payload?.message;
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false;
                // Signup only triggers OTP, doesn't log in yet
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.accessToken = action.payload.accessToken;
                state.school = action.payload.data.school;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Status
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.school = action.payload.data.school;
            })
            // Update School
            .addCase(updateSchool.fulfilled, (state, action) => {
                state.school = action.payload;
            });
    },
});

export const { logout, clearError, updateAccessToken, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
