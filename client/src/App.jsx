import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute    from './components/common/PublicRoute';
import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';

// These pages will be added in the next steps
// import DashboardLayout from './components/layout/DashboardLayout';
// import Dashboard       from './pages/Dashboard';
// import Transactions    from './pages/Transactions';
// import Budgets         from './pages/Budgets';
// import Categories      from './pages/Categories';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      refetchOnWindowFocus: false,
      staleTime:          5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public routes — redirect to dashboard if logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes — redirect to login if not logged in */}
            <Route element={<ProtectedRoute />}>
              {/* Layout + pages will be added in Step 8 */}
              {/* <Route element={<DashboardLayout />}>
                <Route path="/dashboard"    element={<Dashboard />}    />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets"      element={<Budgets />}      />
                <Route path="/categories"   element={<Categories />}   />
              </Route> */}
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login"    replace />} />

          </Routes>
        </BrowserRouter>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily:   'Inter, sans-serif',
              fontSize:     '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;