import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Schedule.css';

const Schedule = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week or day

  useEffect(() => {
    fetchReservations();
  }, [currentDate]);

  const fetchReservations = async () => {
    try {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const response = await api.get('/reservations', {
        params: {
          from: startOfWeek.toISOString(),
          to: endOfWeek.toISOString()
        }
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Erro ao buscar agenda:', error);
      // Mock data
      setReservations([
        {
          _id: '1',
          room: { name: 'Sala 101' },
          professor: { name: 'Prof. João Silva' },
          discipline: { name: 'Matemática' },
          start: new Date(2024, 0, 15, 8, 0).toISOString(),
          end: new Date(2024, 0, 15, 10, 0).toISOString(),
          status: 'active'
        },
        {
          _id: '2',
          room: { name: 'Lab. Informática 1' },
          professor: { name: 'Prof. Maria Santos' },
          discipline: { name: 'Programação Web' },
          start: new Date(2024, 0, 15, 10, 0).toISOString(),
          end: new Date(2024, 0, 15, 12, 0).toISOString(),
          status: 'active'
        },
        {
          _id: '3',
          room: { name: 'Sala 203' },
          professor: { name: 'Prof. Carlos Oliveira' },
          discipline: { name: 'Banco de Dados' },
          start: new Date(2024, 0, 15, 14, 0).toISOString(),
          end: new Date(2024, 0, 15, 16, 0).toISOString(),
          status: 'active'
        }
      ]);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = () => {
    const start = getStartOfWeek(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getReservationsForDay = (day) => {
    return reservations.filter(res => {
      const resDate = new Date(res.start);
      return resDate.toDateString() === day.toDateString();
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7h às 21h

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Agenda de Aulas</h1>
          <p>Visualize os horários das salas e disciplinas</p>
        </div>
        <div className="view-mode-buttons">
          <button 
            className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('week')}
          >
            Semana
          </button>
          <button 
            className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('day')}
          >
            Dia
          </button>
        </div>
      </div>

      <div className="calendar-controls">
        <button className="btn btn-outline" onClick={previousWeek}>
          <ChevronLeft size={18} />
          Anterior
        </button>
        <button className="btn btn-outline" onClick={today}>
          Hoje
        </button>
        <button className="btn btn-outline" onClick={nextWeek}>
          Próxima
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendar-header">
        <Calendar size={20} />
        <h2>{formatDate(currentDate)}</h2>
      </div>

      {viewMode === 'week' ? (
        <div className="week-view">
          <div className="days-grid">
            {getWeekDays().map((day, index) => (
              <div key={index} className={`day-column ${day.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                <div className="day-header">
                  <span className="day-name">
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </span>
                  <span className="day-number">{day.getDate()}</span>
                </div>
                <div className="day-reservations">
                  {getReservationsForDay(day).map(reservation => (
                    <div key={reservation._id} className="reservation-block">
                      <div className="reservation-time">
                        <Clock size={14} />
                        {formatTime(reservation.start)} - {formatTime(reservation.end)}
                      </div>
                      <div className="reservation-room">
                        <MapPin size={14} />
                        {reservation.room?.name}
                      </div>
                      {reservation.discipline && (
                        <div className="reservation-subject">{reservation.discipline.name}</div>
                      )}
                      {reservation.professor && (
                        <div className="reservation-professor">
                          <User size={14} />
                          {reservation.professor.name}
                        </div>
                      )}
                    </div>
                  ))}
                  {getReservationsForDay(day).length === 0 && (
                    <div className="no-reservations">Sem agendamentos</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="day-view">
          <div className="timeline">
            {hours.map(hour => (
              <div key={hour} className="hour-slot">
                <div className="hour-label">{hour}:00</div>
                <div className="hour-content">
                  {getReservationsForDay(currentDate)
                    .filter(res => new Date(res.start).getHours() === hour)
                    .map(reservation => (
                      <div key={reservation._id} className="reservation-card">
                        <div className="reservation-header-card">
                          <span className="badge badge-info">
                            {formatTime(reservation.start)} - {formatTime(reservation.end)}
                          </span>
                        </div>
                        <h4>{reservation.room?.name}</h4>
                        {reservation.discipline && <p>{reservation.discipline.name}</p>}
                        {reservation.professor && (
                          <p className="professor-name">
                            <User size={14} />
                            {reservation.professor.name}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
