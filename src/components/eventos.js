import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const data = await authService.getData('getAll/events');
        if (data && data.docs) {
          // Filtrar eventos que no tengan el estado 'canceled'
          const filteredEvents = data.docs.filter(event => event.status !== 'canceled');
          setEvents(filteredEvents);
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

            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
