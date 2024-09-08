import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, IconButton, Badge, Modal, Box, Divider, AppBar, Toolbar, Grid, Fab } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FlightForm from './components/FlightForm';
import FlightResults from './components/FlightResults';
import Cart from './components/Cart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemCount = useSelector((state) => state.cart.items.length);

  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);
  const handelLogout = () => {

    toast.success('Demo Logout', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  } ;

  return (
    <Router>
      <Box sx={{ flexGrow: 1, mb:2 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                // sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                <AirplanemodeActiveIcon md={{pt:5}} size="small"/> Book My Flight
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                <IconButton 
                  onClick={handleOpenCart} 
                  size="large" 
                  aria-label="show Cart" 
                  color="inherit"
                >
                  <Badge badgeContent={cartItemCount} color="secondary">
                      <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={handelLogout}
                  size="large"
                  aria-label="show Logout"
                  color="inherit"
                >
                  <PowerSettingsNewIcon />
                </IconButton>

              </Box>
            </Toolbar>
          </AppBar>
      </Box>
      <Container>
        

        <Routes>
          <Route path="/" element={<FlightForm />} />
          <Route path="flight/list" element={<FlightResults />} />
        </Routes>

        
        <IconButton
          color="primary"
          onClick={handleOpenCart}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <Fab color="primary" aria-label="add">
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon fontSize="large" />
            </Badge>
          </Fab>
        </IconButton>
        

        <Modal
          open={cartOpen}
          onClose={handleCloseCart}
          aria-labelledby="cart-modal-title"
          aria-describedby="cart-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 800,
              maxHeight: '80%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
            }}
          >
            <Grid container >
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Typography variant="h6" id="cart-modal-title">
                  Your Cart
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Box display="flex" justifyContent="flex-end">
                  <HighlightOffIcon onClick={handleCloseCart} fontSize="large" />
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            <Cart />
          </Box>
        </Modal>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Container>
    </Router>
  );
};

export default App;
