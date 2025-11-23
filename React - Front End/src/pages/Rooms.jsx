import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, DoorOpen } from 'lucide-react';
import api from '../services/api';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    type: 'classroom',
    equipment: '',
    status: 'available'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      fetchRooms();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await api.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
      }
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      type: room.type,
      equipment: room.equipment?.join(', ') || '',
      status: room.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      name: '',
      capacity: '',
      type: 'classroom',
      equipment: '',
      status: 'available'
    });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Gerenciamento de Salas</h1>
          <p>Gerencie salas e equipamentos disponíveis</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nova Sala
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <div key={room._id} className="room-card">
            <div className="room-header">
              <div className="room-icon">
                <DoorOpen size={24} />
              </div>
              <span className={`badge badge-${room.status === 'available' ? 'success' : 'warning'}`}>
                {room.status === 'available' ? 'Disponível' : 'Manutenção'}
              </span>
            </div>
            
            <h3>{room.name}</h3>
            
            <div className="room-details">
              <div className="detail-item">
                <span className="detail-label">Capacidade:</span>
                <span className="detail-value">{room.capacity} pessoas</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">
                  {room.type === 'classroom' && 'Sala de Aula'}
                  {room.type === 'lab' && 'Laboratório'}
                  {room.type === 'auditorium' && 'Auditório'}
                </span>
              </div>
              {room.equipment && room.equipment.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Equipamentos:</span>
                  <span className="detail-value">{room.equipment.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="room-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEdit(room)}>
                <Edit size={16} />
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room._id)}>
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRoom ? 'Editar Sala' : 'Nova Sala'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome da Sala *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Capacidade *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="classroom">Sala de Aula</option>
                    <option value="lab">Laboratório</option>
                    <option value="auditorium">Auditório</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Equipamentos (separados por vírgula)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Projetor, Quadro Branco, Ar Condicionado"
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="available">Disponível</option>
                  <option value="maintenance">Manutenção</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
