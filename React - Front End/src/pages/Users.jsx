import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { name: '', email: '', password: '', role: 'student' };

const roleLabels = {
  coord: 'Coordenação',
  professor: 'Professor',
  student: 'Aluno',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Carregar usuários
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setAlert({ type: 'error', message: 'Erro ao carregar usuários' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      if (editing) {
        await api.put(`/users/${editing._id}`, form);
        setAlert({ type: 'success', message: 'Usuário atualizado!' });
      } else {
        await api.post('/users', form);
        setAlert({ type: 'success', message: 'Usuário criado!' });
      }
      setForm(initialForm);
      setEditing(null);
      fetchUsers();
    } catch (err) {
      setAlert({ type: 'error', message: err?.response?.data?.msg || 'Erro ao salvar usuário' });
    }
    setLoading(false);
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditing(user);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este usuário?')) return;
    try {
      await api.delete(`/users/${id}`);
      setAlert({ type: 'success', message: 'Usuário removido!' });
      fetchUsers();
    } catch {
      setAlert({ type: 'error', message: 'Erro ao remover usuário' });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1>Gestão de Usuários</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, background: '#f8f8f8', padding: 24, borderRadius: 8 }}>
        <h2>{editing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
        <div style={{ display: 'flex', gap: 16 }}>
          <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="form-input" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="form-input" />
          <input type="password" placeholder="Senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editing} className="form-input" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-input">
            <option value="coord">Coordenação</option>
            <option value="professor">Professor</option>
            <option value="student">Aluno</option>
          </select>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Salvando...' : (editing ? 'Salvar' : 'Criar')}</button>
          {editing && <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={() => { setEditing(null); setForm(initialForm); }}>Cancelar</button>}
        </div>
      </form>
      <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px #0001' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>Nome</th>
            <th>Email</th>
            <th>Papel</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{roleLabels[u.role] || u.role}</td>
              <td>
                <button className="btn btn-sm" onClick={() => handleEdit(u)}>Editar</button>
                <button className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => handleDelete(u._id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
