import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const pageTitles = {
  '/dashboard':    { title: 'Dashboard',    subtitle: 'Your financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Track every transaction' },
  '/budgets':      { title: 'Budgets',      subtitle: 'Manage your spending limits' },
  '/categories':   { title: 'Categories',   subtitle: 'Organize your finances' },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const pageInfo  = pageTitles[location.pathname] || { title: 'FinanceTracker' };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;