import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function ConfirmAssist(props) {
  const { id, eventName, fetchFreshData } = props;

  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancelEvent = () => {
    const data = {
      status: 'canceled',
    };

    axios.put(`https://api-ruth-production.up.railway.app/${id}/status/events`, data)
      .then(response => {
        setSyncResult({ success: true });
      })
      .catch(error => {
        console.error('Error al cancelar el evento:', error);
        setSyncResult({ success: false, error });
      })
      .finally(() => {
        setOpen(false);
        setConfirmClicked(true);
        try {
          fetchFreshData();
        } catch (error) {
          console.error('Error al actualizar datos:', error);
        }
      });
  };

  return (
    <React.Fragment>
      <Tooltip title="Cancelar evento" placement="top">
        <Button
          onClick={handleClickOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          variant="contained"
          color="primary"
        >
          Cancelar
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{`Cancelar ${eventName}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar {eventName}?
          </DialogContentText>
          {syncResult && syncResult.success && (
            <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon color="success" />
              <span style={{ marginLeft: '8px' }}>Evento cancelado correctamente</span>
            </div>
          )}
          {syncResult && !syncResult.success && (
            <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
              <ErrorIcon color="error" />
              <span style={{ marginLeft: '8px' }}>Error al cancelar el evento: {syncResult.error.message}</span>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleCancelEvent} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ConfirmAssist.propTypes = {
  id: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  fetchFreshData: PropTypes.func.isRequired,
};
