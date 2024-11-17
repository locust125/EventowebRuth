import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import authService from 'src/services/auth-service';
import L from 'leaflet';

// Icono personalizado para el marcador
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function BasicCard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para almacenar la fecha seleccionada

  // Usar useEffect correctamente sin duplicaciones
  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const formattedDate = formatDate(selectedDate); // Formatea la fecha seleccionada
        const data = await authService.getData(`events/${formattedDate}`); // Utiliza la fecha formateada en el endpoint
        console.log('Datos recibidos:', data); // Verificar los datos recibidos
        if (Array.isArray(data)) {
          console.log('Eventos antes de setEvents:', data); // Verificar los datos antes de actualizar el estado
          setEvents(data);
          console.log('Eventos actualizados:', data); // Verificar los datos actualizados
        } else {
          console.log('Unexpected data structure:', data); // Verificar cuando no hay docs en los datos
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventsData(); // Llama a la función dentro de useEffect
  }, [selectedDate]); // Dependencia de selectedDate

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const localDate = new Date(e.target.value);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset()); // Ajuste para zona horaria local
    setSelectedDate(localDate); // Actualiza la fecha seleccionada
  };

  const handleClickOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ marginLeft: '20px' }}>
      {/* Campo de entrada de fecha */}
      <TextField
        id="date"
        label="Selecciona una fecha"
        type="date"
        defaultValue={selectedDate.toISOString().slice(0, 10)} // Establece la fecha inicial en el formato esperado
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleDateChange}
        style={{ marginBottom: '20px', marginLeft: '20px' }}
      />
      <Grid container spacing={2} sx={{ marginLeft: '20px' }}>
        {events && events.length > 0 ? events.map(event => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {event.dateTime}
                </Typography>
                <Typography variant="h5" component="div">
                  {event.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {event.guests.join(', ')}
                </Typography>
                <Typography variant="body2">
                  {event.description}
                  <br />
                  Costo: ${event.price}<br />
                  Asistencias confirmadas: {event.statusAssist}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) : <Typography>No hay eventos para la fecha seleccionada.</Typography>}
      </Grid>
      {selectedEvent && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Event Location</DialogTitle>
          <DialogContent>
            <MapContainer
              center={[selectedEvent.location.coordinates[1], selectedEvent.location.coordinates[0]]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[selectedEvent.location.coordinates[1], selectedEvent.location.coordinates[0]]}
                icon={customIcon}
              />
            </MapContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
