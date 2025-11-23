import { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Users, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // all, room, professor, discipline
  const [filters, setFilters] = useState({
    date: '',
    minCapacity: '',
    equipment: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Aqui você faria chamadas diferentes dependendo do searchType
      // Por enquanto, vamos usar dados mockados
      setTimeout(() => {
        setResults([
          {
            id: 1,
            type: 'room',
            name: 'Sala 101',
            capacity: 40,
            equipment: ['Projetor', 'Quadro Branco'],
            available: true,
            nextAvailable: '14:00'
          },
          {
            id: 2,
            type: 'professor',
            name: 'Prof. João Silva',
            discipline: 'Matemática',
            room: 'Sala 101',
            nextClass: 'Hoje 14:00'
          },
          {
            id: 3,
            type: 'discipline',
            name: 'Programação Web',
            professor: 'Prof. Maria Santos',
            room: 'Lab. Informática 1',
            schedule: 'Seg/Qua 10:00-12:00'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Buscar</h1>
          <p>Encontre salas, professores e disciplinas</p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-bar-large">
          <SearchIcon size={24} />
          <input
            type="text"
            className="search-input-large"
            placeholder="Buscar por sala, professor ou disciplina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="search-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${searchType === 'all' ? 'active' : ''}`}
              onClick={() => setSearchType('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-tab ${searchType === 'room' ? 'active' : ''}`}
              onClick={() => setSearchType('room')}
            >
              Salas
            </button>
            <button 
              className={`filter-tab ${searchType === 'professor' ? 'active' : ''}`}
              onClick={() => setSearchType('professor')}
            >
              Professores
            </button>
            <button 
              className={`filter-tab ${searchType === 'discipline' ? 'active' : ''}`}
              onClick={() => setSearchType('discipline')}
            >
              Disciplinas
            </button>
          </div>

          <details className="advanced-filters">
            <summary>
              <Filter size={16} />
              Filtros Avançados
            </summary>
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-input"
                  value={filters.date}
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Capacidade Mínima</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Ex: 30"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Equipamento</label>
                <select
                  className="form-input"
                  value={filters.equipment}
                  onChange={(e) => setFilters({...filters, equipment: e.target.value})}
                >
                  <option value="">Todos</option>
                  <option value="projetor">Projetor</option>
                  <option value="computador">Computador</option>
                  <option value="arcondicionado">Ar Condicionado</option>
                </select>
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="search-results">
        {results.length === 0 && !loading && (
          <div className="empty-state">
            <SearchIcon size={48} />
            <h3>Faça uma busca</h3>
            <p>Digite o nome de uma sala, professor ou disciplina para começar</p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Buscando...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-grid">
            {results.map(result => (
              <div key={result.id} className="result-card">
                {result.type === 'room' && (
                  <>
                    <div className="result-header">
                      <div className="result-icon room">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3>{result.name}</h3>
                        <span className="result-type">Sala</span>
                      </div>
                      <span className={`badge ${result.available ? 'badge-success' : 'badge-warning'}`}>
                        {result.available ? 'Disponível' : 'Ocupada'}
                      </span>
                    </div>
                    <div className="result-details">
                      <div className="detail-row">
                        <Users size={16} />
                        <span>Capacidade: {result.capacity} pessoas</span>
                      </div>
                      <div className="detail-row">
                        <Clock size={16} />
                        <span>Próximo horário: {result.nextAvailable}</span>
                      </div>
                      {result.equipment && (
                        <div className="equipment-tags">
                          {result.equipment.map((eq, idx) => (
                            <span key={idx} className="equipment-tag">{eq}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {result.type === 'professor' && (
                  <>
                    <div className="result-header">
                      <div className="result-icon professor">
                        <Users size={20} />
                      </div>
                      <div>
                        <h3>{result.name}</h3>
                        <span className="result-type">Professor</span>
                      </div>
                    </div>
                    <div className="result-details">
                      <div className="detail-row">
                        <Calendar size={16} />
                        <span>Disciplina: {result.discipline}</span>
                      </div>
                      <div className="detail-row">
                        <MapPin size={16} />
                        <span>Local: {result.room}</span>
                      </div>
                      <div className="detail-row">
                        <Clock size={16} />
                        <span>Próxima aula: {result.nextClass}</span>
                      </div>
                    </div>
                  </>
                )}

                {result.type === 'discipline' && (
                  <>
                    <div className="result-header">
                      <div className="result-icon discipline">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h3>{result.name}</h3>
                        <span className="result-type">Disciplina</span>
                      </div>
                    </div>
                    <div className="result-details">
                      <div className="detail-row">
                        <Users size={16} />
                        <span>Professor: {result.professor}</span>
                      </div>
                      <div className="detail-row">
                        <MapPin size={16} />
                        <span>Local: {result.room}</span>
                      </div>
                      <div className="detail-row">
                        <Clock size={16} />
                        <span>Horário: {result.schedule}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
