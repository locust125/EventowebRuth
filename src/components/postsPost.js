import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import authService from 'src/services/auth-service';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useRouter } from 'next/router';
import L from "leaflet" // Importa Leaflet para personalizar el icono del marcador

// Icono personalizado para el marcador
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function EventForm() {
  const [syncResult, setSyncResult] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [guests, setGuests] = React.useState('');
  const [price, setPrice] = React.useState('0');
  const [dateTime, setDateTime] = React.useState('');
  const [location, setLocation] = React.useState({ lat: 21.033814446524936, lng: -89.62959229946136 });
  const router = useRouter();

  const handleConfirm = async () => {
    const userData = JSON.parse(localStorage.userinfo);
    const idUser = userData?.id;

    if (!idUser) {
      setSyncResult({
        success: false,
        error: new Error('Usuario no autenticado'),
      });
      return;
    }

    const dateTimeObject = new Date(dateTime);
    if (isNaN(dateTimeObject)) {
      setSyncResult({
        success: false,
        error: new Error('Fecha y hora no válidas'),
      });
      return;
    }

    const eventDetails = {
      name: title,
      dateTime: dateTimeObject.toISOString(),
      description,
      guests: guests.split(',').map(guest => guest.trim()),
      price,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
      },
      status: 'active',
    };

    try {
      const response = await authService.postData('createEvent', eventDetails);
      console.log('Evento creado exitosamente', response);
      setSyncResult({ success: true });

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error al crear evento', error);
      setSyncResult({ success: false, error });
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });

    return location === null ? null : (
      <Marker position={location} icon={customIcon}></Marker>
    );
  }

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Agregar nuevo evento
      </Typography>
      <Typography variant="body1" gutterBottom>
        Llena los detalles del evento.
      </Typography>
      <TextField
        autoFocus
        margin="dense"
        id="title"
        label="Nombre del Evento"
        type="text"
        fullWidth
        variant="outlined"
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        margin="dense"
        id="dateTime"
        label="Fecha y Hora"
        type="datetime-local"
        fullWidth
        variant="outlined"
        value={dateTime}
        InputLabelProps={{
          shrink: true
        }}
        onChange={e => setDateTime(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        margin="dense"
        id="description"
        label="Descripción"
        type="text"
        fullWidth
        variant="outlined"
        multiline
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      {/* <TextField
        margin="dense"
        id="guests"
        label="Invitados (separados por comas)"
        type="text"
        fullWidth
        variant="outlined"
        value={guests}
        onChange={e => setGuests(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        margin="dense"
        id="price"
        label="Precio"
        type="text"
        fullWidth
        variant="outlined"
        value={price}
        onChange={e => setPrice(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <Box mt={2} sx={{ height: '300px', width: '100%' }}>
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </Box> */}
      {syncResult && syncResult.success && (
        <Typography sx={{ mt: 2, color: 'green' }}>
          Evento creado exitosamente
        </Typography>
      )}
      {syncResult && !syncResult.success && (
        <Typography sx={{ mt: 2, color: 'red' }}>
          Error al crear evento: {syncResult.error.message}
        </Typography>
      )}
      <Button
        onClick={handleConfirm}
        variant="contained"
        disabled={syncResult && syncResult.success}
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          '&:hover': { backgroundColor: '#115293' },
          marginTop: '16px',
        }}
      >
        Confirmar
      </Button>
    </Box>
  );
}
