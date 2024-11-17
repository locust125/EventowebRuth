import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import authService from 'src/services/auth-service';
import L from 'leaflet';
import Gestion from './gestion';

// Icono personalizado para el marcador
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const data = await authService.getData('getAll/events');
        if (data && data.docs) {
          setEvents(data.docs);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventsData();
  }, []);

  const handleClickOpen = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {event.dateTime}
                </Typography>
                <Typography variant="h5" component="div">
                  {event.name}
                </Typography>
                <Typography variant="body2">
                  {event.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Gestion
                id= {event._id}
                eventName= {event.name}
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
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
