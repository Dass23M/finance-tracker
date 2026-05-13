import { createContext, useContext, useReducer, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getMe } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user:            null,
  accessToken:     localStorage.getItem('accessToken') || null,
  isLoading:       true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOGIN_SUCCESS':
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user:            action.payload.user,
        accessToken:     action.payload.accessToken,
        isAuthenticated: true,
        isLoading:       false,
      };

    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return {
        ...state,
        user:            null,
        accessToken:     null,
        isAuthenticated: false,
        isLoading:       false,
      };

    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app load — verify existing token and restore session
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const res = await getMe();
        dispatch({
          type:    'LOGIN_SUCCESS',
          payload: { user: res.data.user, accessToken: token },
        });
      } catch {
        // Token invalid or expired — clear everything
        dispatch({ type: 'LOGOUT' });
      }
    };
    initializeAuth();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    dispatch({
      type:    'LOGIN_SUCCESS',
      payload: {
        user:        res.data.user,
        accessToken: res.data.accessToken,
      },
    });
    toast.success(`Welcome back, ${res.data.user.name}!`);
    return res;
  };

  // ── Register ─────────────────────────────────────────────────────────────
  // IMPORTANT: We do NOT dispatch LOGIN_SUCCESS here.
  // We do NOT store any token here.
  // The Register page will navigate to /login after this resolves.
  const register = async (userData) => {
    const res = await registerUser(userData);
    // Just return — do nothing else
    return res;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if API call fails, clear local state anyway
    } finally {
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};