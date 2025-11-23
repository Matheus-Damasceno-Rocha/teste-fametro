import { useState } from 'react';
import { User, Mail, Lock, Bell, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    reservationConfirmed: true,
    reservationChanged: true,
    reservationCancelled: true,
    reminderBefore: true
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria a chamada à API
    alert('Perfil atualizado com sucesso!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Aqui você faria a chamada à API
    alert('Senha alterada com sucesso!');
    setFormData({...formData, currentPassword: '', newPassword: '', confirmPassword: ''});
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria a chamada à API
    alert('Preferências de notificação atualizadas!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie suas preferências e informações pessoais</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Perfil
          </button>
          <button 
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={18} />
            Senha
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notificações
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Informações do Perfil</h2>
              <p className="section-description">
                Atualize suas informações pessoais
              </p>

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Usuário</label>
                  <input
                    type="text"
                    className="form-input"
                    value={
                      user?.userType === 'coordinator' ? 'Coordenação' :
                      user?.userType === 'teacher' ? 'Professor' :
                      user?.isGuest ? 'Visitante' : 'Aluno'
                    }
                    disabled
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="settings-section">
              <h2>Alterar Senha</h2>
              <p className="section-description">
                Mantenha sua conta segura com uma senha forte
              </p>

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Senha Atual</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Digite sua senha atual"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nova Senha</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Digite sua nova senha"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <small className="form-hint">Mínimo de 6 caracteres</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmar Nova Senha</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirme sua nova senha"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Alterar Senha
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Preferências de Notificação</h2>
              <p className="section-description">
                Escolha como deseja receber notificações
              </p>

              <form onSubmit={handleNotificationsSubmit}>
                <div className="notification-options">
                  <div className="notification-item">
                    <div>
                      <h4>Notificações por E-mail</h4>
                      <p>Receba notificações no seu e-mail</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <h4>Reserva Confirmada</h4>
                      <p>Notificar quando uma reserva for confirmada</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.reservationConfirmed}
                        onChange={(e) => setNotifications({...notifications, reservationConfirmed: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <h4>Alterações de Reserva</h4>
                      <p>Notificar sobre mudanças em reservas</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.reservationChanged}
                        onChange={(e) => setNotifications({...notifications, reservationChanged: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <h4>Cancelamentos</h4>
                      <p>Notificar quando uma reserva for cancelada</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.reservationCancelled}
                        onChange={(e) => setNotifications({...notifications, reservationCancelled: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <h4>Lembrete Antecipado</h4>
                      <p>Receber lembrete 1 hora antes da aula</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.reminderBefore}
                        onChange={(e) => setNotifications({...notifications, reminderBefore: e.target.checked})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Salvar Preferências
                </button>
              </form>
            </div>
          )}

          <div className="danger-zone">
            <h3>Zona de Perigo</h3>
            <p>Ações irreversíveis</p>
            <button className="btn btn-danger" onClick={logout}>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
