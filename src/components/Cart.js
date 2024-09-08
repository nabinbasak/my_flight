import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Typography, Button, Box, Grid } from '@mui/material';
import { removeFromCart, clearCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const calculateTotalCost = () => {
    let totalAmount = items.reduce((total, item) => {
      let amt =  (item?.passengerTypeFareList[item?.passengerTypeFareList.length-1] && item?.passengerTypeFareList[item?.passengerTypeFareList.length-1]?.grand_total > 0) ? item?.passengerTypeFareList[item?.passengerTypeFareList.length-1]?.grand_total : 0
      return total + amt}, 0);
    return (totalAmount > 0) ? totalAmount.toFixed(2) : ""
  };


  const handleRemove = (id) => {
    // alert(id)
    console.log("handleRemove : ",id)
    dispatch(removeFromCart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handelBookNow = () => {
    toast.success('Demo Book Now', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Your Cart</Typography>
      {items && items.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Flight Details</TableCell>
                <TableCell align="right">Departure</TableCell>
                <TableCell align="right">Arrival</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items && items.length > 0 && items.map((item,i) => {
                let grand_total =  (item?.passengerTypeFareList[item?.passengerTypeFareList.length-1] && item?.passengerTypeFareList[item?.passengerTypeFareList.length-1]?.grand_total > 0) ? item?.passengerTypeFareList[item?.passengerTypeFareList.length-1]?.grand_total : 0
                return (
                <TableRow key={item.fareId}>
                  <TableCell>
                    {(i+1)}
                  </TableCell>
                  <TableCell>
                    {`Flight from ${item.flyingFrom} to ${item.flyingTo}`}<br/>
                    {item.date.toDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {`${item.dTime}`}
                  </TableCell>
                  <TableCell align="right">
                    {`${item.aTime}`}
                  </TableCell>
                  <TableCell align="right">
                    {`${(grand_total > 0) ? grand_total.toFixed(2) : ""} ${item.passengerTypeFareList[0]?.priceList[0]?.currency?.iso}`}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="secondary" onClick={() => handleRemove(item.fareId)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )} )}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* <TableCell colSpan={6}></TableCell> */}
                <TableCell colSpan={6} align="right">
                  <Typography variant="h6">Total: {calculateTotalCost()} {items.length > 0 && items[0]?.passengerTypeFareList[0]?.priceList[0]?.currency?.iso}</Typography>
                </TableCell>
                {/* <TableCell></TableCell> */}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No items in the cart</Typography>
      )}

      {items.length > 0 && (
        <Grid container >
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" color="primary" onClick={handleClear}>
                        Clear Cart
                      </Button>
                    </Box>
                
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
                      <Button onClick={handelBookNow} variant="contained" color="success">
                        Book Now
                      </Button>
                  </Box>
                </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
