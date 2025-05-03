import React from 'react';
import { Modal, Typography, Box, Button } from '@mui/material';

const ConfirmationModal = ({ open, handleClose, handleConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="confirmation-modal-title" variant="h6" component="h2" gutterBottom>
          Confirm Unassign
        </Typography>
        <Typography id="confirmation-modal-description" sx={{ mb: 2 }}>
          Are you sure you want to remove this pentester?
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
