import { useEffect, useState } from 'react';
import api from '../services/api';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch {
      setAlert({ type: 'error', message: 'Erro ao carregar agendamentos' });
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancelar este agendamento?')) return;
    try {
      // await api.delete(`/reservations/${id}`); // Quando a API estiver pronta
      setAlert({ type: 'success', message: 'Reserva cancelada!' });
      setReservations(reservations.filter(r => r._id !== id));
    } catch {
      setAlert({ type: 'error', message: 'Erro ao cancelar reserva' });
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1>Agendamentos</h1>
      {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px #0001', marginTop: 24 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>Sala</th>
            <th>Disciplina</th>
            <th>Professor</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r._id}>
              <td>{r.room?.name || '-'}</td>
              <td>{r.discipline?.name || '-'}</td>
              <td>{r.professor?.name || '-'}</td>
              <td>{r.start ? new Date(r.start).toLocaleDateString() : '-'}</td>
              <td>{r.start && r.end ? `${new Date(r.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '-'}</td>
              <td>{r.status || 'ativo'}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r._id)}>Cancelar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Carregando...</p>}
      {!loading && reservations.length === 0 && <p style={{ marginTop: 32 }}>Nenhum agendamento encontrado.</p>}
    </div>
  );
};

export default Reservations;
