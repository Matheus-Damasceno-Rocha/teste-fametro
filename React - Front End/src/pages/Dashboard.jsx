import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  DoorOpen, 
  Users, 
  Clock, 
  Bell,
  Plus,
  Search,
  TrendingUp,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import api from '../services/api';

const Dashboard = () => {
  const { user, isCoordinator, isTeacher, isStudent } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ sala: '', data: '', horaInicio: '', horaFim: '', disciplina: '', observacao: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [cancelAlert, setCancelAlert] = useState({ type: '', message: '' });

  // Função para enviar reserva (mock/simples)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setLoading(true);
    try {
      // Exemplo de payload
      const payload = {
        room: form.sala,
        start: form.data + 'T' + form.horaInicio,
        end: form.data + 'T' + form.horaFim,
        discipline: form.disciplina,
        observacao: form.observacao,
      };
      await api.post('/reservations', payload);
      setAlert({ type: 'success', message: 'Reserva criada com sucesso!' });
      setForm({ sala: '', data: '', horaInicio: '', horaFim: '', disciplina: '', observacao: '' });
      setTimeout(() => setShowModal(false), 1200);
    } catch (err) {
      setAlert({ type: 'error', message: err?.response?.data?.msg || 'Erro ao criar reserva' });
    }
    setLoading(false);
  };

  // Função para cancelar reserva (mock)
  const handleCancel = async (reservationId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) return;
    setCancelAlert({ type: '', message: '' });
    try {
      // await api.delete(`/reservations/${reservationId}`); // Descomente quando a API estiver pronta
      setCancelAlert({ type: 'success', message: 'Reserva cancelada com sucesso!' });
      // Aqui você pode atualizar a lista de reservas se estiver usando dados reais
    } catch (err) {
      setCancelAlert({ type: 'error', message: err?.response?.data?.msg || 'Erro ao cancelar reserva' });
    }
  };

  // Dashboard da Coordenação
  if (isCoordinator) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard - Coordenação</h1>
            <p>Bem-vindo(a), {user?.name}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon rooms">
              <DoorOpen size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total de Salas</p>
              <h3 className="stat-value">24</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Usuários Ativos</p>
              <h3 className="stat-value">156</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon reservations">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Agendamentos Hoje</p>
              <h3 className="stat-value">12</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pendentes</p>
              <h3 className="stat-value">3</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Ações Rápidas</h2>
            <div className="quick-actions">
              <Link to="/rooms" className="action-btn">
                <DoorOpen size={20} />
                <span>Gerenciar Salas</span>
              </Link>
              <Link to="/users" className="action-btn">
                <Users size={20} />
                <span>Gerenciar Usuários</span>
              </Link>
              <Link to="/reservations" className="action-btn">
                <Calendar size={20} />
                <span>Ver Agendamentos</span>
              </Link>
              <Link to="/notifications" className="action-btn">
                <Bell size={20} />
                <span>Notificações</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Agendamentos Recentes</h2>
            <div className="reservations-list">
              <div className="reservation-item">
                <div>
                  <p className="reservation-room">Sala 101</p>
                  <p className="reservation-info">Prof. João Silva - 10:00 - 12:00</p>
                </div>
                <span className="badge badge-success">Confirmado</span>
              </div>
              <div className="reservation-item">
                <div>
                  <p className="reservation-room">Lab. Informática 1</p>
                  <p className="reservation-info">Prof. Maria Santos - 14:00 - 16:00</p>
                </div>
                <span className="badge badge-warning">Pendente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard do Professor
  if (isTeacher) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Meus Agendamentos</h1>
            <p>Bem-vindo(a), {user?.name}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Nova Reserva
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon reservations">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Agendamentos Ativos</p>
              <h3 className="stat-value">8</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Próxima Aula</p>
              <h3 className="stat-value">Hoje 14h</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Meus Próximos Agendamentos</h2>
            {cancelAlert.message && (
              <div className={`alert alert-${cancelAlert.type}`}>{cancelAlert.message}</div>
            )}
            <div className="reservations-list">
              <div className="reservation-item">
                <div>
                  <p className="reservation-room">Sala 101</p>
                  <p className="reservation-info">Matemática - Hoje 14:00 - 16:00</p>
                </div>
                <span className="badge badge-info">Hoje</span>
                <button className="btn btn-danger btn-sm" title="Cancelar Reserva" onClick={() => handleCancel('1')} style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <X size={16} /> Cancelar
                </button>
              </div>
              <div className="reservation-item">
                <div>
                  <p className="reservation-room">Lab. Química</p>
                  <p className="reservation-info">Química Orgânica - Amanhã 10:00 - 12:00</p>
                </div>
                <span className="badge badge-success">Confirmado</span>
                <button className="btn btn-danger btn-sm" title="Cancelar Reserva" onClick={() => handleCancel('2')} style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <X size={16} /> Cancelar
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Ações Rápidas</h2>
            <div className="quick-actions">
              <Link to="/reservations/new" className="action-btn">
                <Plus size={20} />
                <span>Nova Reserva</span>
              </Link>
              <Link to="/schedule" className="action-btn">
                <Calendar size={20} />
                <span>Ver Agenda</span>
              </Link>
              <Link to="/search" className="action-btn">
                <Search size={20} />
                <span>Buscar Sala</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Modal de Nova Reserva */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
              <div className="modal-header">
                <h2>Nova Reserva</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: 24 }}>
                {alert.message && (
                  <div className={`alert alert-${alert.type}`}>{alert.message}</div>
                )}
                <div className="form-group">
                  <label className="form-label">Sala</label>
                  <input type="text" className="form-input" value={form.sala} onChange={e => setForm({ ...form, sala: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <input type="date" className="form-input" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hora Início</label>
                    <input type="time" className="form-input" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora Fim</label>
                    <input type="time" className="form-input" value={form.horaFim} onChange={e => setForm({ ...form, horaFim: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Disciplina</label>
                  <input type="text" className="form-input" value={form.disciplina} onChange={e => setForm({ ...form, disciplina: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Observação</label>
                  <textarea className="form-input" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard do Aluno/Visitante
  if (isStudent) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Consultar Agenda</h1>
            <p>Bem-vindo(a), {user?.name}</p>
          </div>
        </div>
        <div className="dashboard-card search-card">
          <h2>Solicitar Reserva</h2>
          <p className="search-description">
            Preencha para solicitar uma reserva simples de sala
          </p>
          <form className="search-form" onSubmit={handleSubmit} style={{ flexDirection: 'column', gap: 12 }}>
            {alert.message && (
              <div className={`alert alert-${alert.type}`}>{alert.message}</div>
            )}
            <input type="text" className="form-input" placeholder="Sala desejada" value={form.sala} onChange={e => setForm({ ...form, sala: e.target.value })} required />
            <input type="date" className="form-input" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} required />
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="time" className="form-input" placeholder="Início" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })} required />
              <input type="time" className="form-input" placeholder="Fim" value={form.horaFim} onChange={e => setForm({ ...form, horaFim: e.target.value })} required />
            </div>
            <textarea className="form-input" placeholder="Observação" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar Reserva'}</button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
