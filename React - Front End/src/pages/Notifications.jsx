import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Calendar, Info } from 'lucide-react';
import api from '../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      // Mock data para demonstração
      setNotifications([
        {
          _id: '1',
          type: 'reservation_confirmed',
          message: 'Sua reserva da Sala 101 foi confirmada para amanhã às 14:00',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          type: 'reservation_changed',
          message: 'Atenção: A aula de Matemática foi transferida para o Lab. 2',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: '3',
          type: 'reservation_cancelled',
          message: 'A reserva da Sala 203 para 10/02 foi cancelada',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
      ]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? {...n, isRead: true} : n
      ));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({...n, isRead: true})));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'reservation_confirmed':
        return <Check size={20} />;
      case 'reservation_changed':
        return <AlertCircle size={20} />;
      case 'reservation_cancelled':
        return <X size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'reservation_confirmed':
        return 'success';
      case 'reservation_changed':
        return 'warning';
      case 'reservation_cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Notificações</h1>
          <p>{unreadCount} não lidas</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllAsRead}>
            <Check size={18} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Não lidas ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Lidas ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>Nenhuma notificação</h3>
            <p>Você não tem notificações no momento</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className={`notification-icon ${getColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="notification-actions">
                {!notification.isRead && (
                  <button 
                    className="icon-btn"
                    onClick={() => markAsRead(notification._id)}
                    title="Marcar como lida"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button 
                  className="icon-btn danger"
                  onClick={() => deleteNotification(notification._id)}
                  title="Excluir"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
