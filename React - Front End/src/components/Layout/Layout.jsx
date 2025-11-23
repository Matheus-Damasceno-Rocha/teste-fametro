import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  DoorOpen, 
  Users, 
  Calendar, 
  Settings, 
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isCoordinator, isTeacher } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
      roles: ['coord', 'professor', 'student']
    },
    {
      icon: DoorOpen,
      label: 'Salas e Equipamentos',
      path: '/rooms',
      roles: ['coord']
    },
    {
      icon: Users,
      label: 'Usuários',
      path: '/users',
      roles: ['coord']
    },
    {
      icon: Calendar,
      label: 'Agendamentos',
      path: '/reservations',
      roles: ['coord', 'professor']
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/schedule',
      roles: ['student']
    },
    {
      icon: Settings,
      label: 'Configurações',
      path: '/settings',
      roles: ['coord', 'professor', 'student']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Reservas Fametro</h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="header-actions">
            <Link to="/notifications" className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </Link>

            <div className="user-menu">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">
                  {user?.role === 'coord' && 'Coordenação'}
                  {user?.role === 'professor' && 'Professor'}
                  {user?.role === 'student' && user?.isGuest ? 'Visitante' : user?.role === 'student' ? 'Aluno' : ''}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
