import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../../redux/authSlice';

const AccessGate = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AccessGate;
