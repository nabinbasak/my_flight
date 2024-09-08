import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Autocomplete, TextField, Button, Grid, Container, CircularProgress, MenuItem, Typography, Backdrop } from '@mui/material';
import { fetchAirports as fetchFromAirports } from '../slices/fromAirportSlice';
import { fetchAirports as fetchToAirports } from '../slices/toAirportSlice';
import { searchFlights } from '../slices/flightSearchSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateForm } from '../slices/formSlice';

const validationSchema = yup.object({
  flyingFrom: yup.string().required('Flying From is required'),
  flyingTo: yup.string().required('Flying To is required'),
  departureDate: yup.date().required('Departure Date is required'),
  travellers: yup.number().min(1, 'At least 1 traveller').required('Travellers are required'),
  childs: yup.number().min(0, 'Can Not be Negative'),
  infants: yup.number().min(0, 'Can Not be Negative'),
  preferredClass: yup.string().required('Preferred Class is required'),
});

const FlightForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { airports: fromAirports, loading: fromAirportsLoading } = useSelector((state) => state.fromAirports);
  const { airports: toAirports, loading: toAirportsLoading } = useSelector((state) => state.toAirports);
  const { flights, loading: flightsLoading } = useSelector((state) => state.flightSearch);
  // const formData = useSelector((state) => state.form);
  
  // const [optionFrom,setOptionFrom] = useState([])
  // const [optionTo,setOptionTo] = useState([])
  const [isSearch,setIsSearch] = useState(false)

  useEffect(()=>{
    if(flights && flights?.flightSearchList?.availableFareList.length > 0){
      navigate("/flight/list")
    }else{
      if(isSearch){
        toast.error('No Flight Found.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          setIsSearch(false)
      }
    }
  },[flights])

  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    
  const today = localISOTime.split('T')[0];

  function isValidDate(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    console.log("selectedDate : ",selectedDate,(selected >= today))
    return selected >= today;
  }

  const formik = useFormik({
    initialValues: {
      flyingFrom: '',
      flyingTo: '',
      departureDate: today,
      travellers: 1,
      childs : 0,
      infants: 0,
      preferredClass: 'ECONOMY',
      flyingFromName: '',
      flyingToName: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const date = new Date(values.departureDate);
      if(values.flyingFrom === values.flyingTo){
          toast.error('Flying From and Flying To cannot be the same.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          return false
      }
      if(!isValidDate(values.departureDate)){
        toast.error('Departure Date should not be less than current date', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        return false
      }
      setIsSearch(true)
      const searchParams = {
        user_id: 0,
        from_airport: values.flyingFrom,
        to_airport: values.flyingTo,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        round_year: '',
        round_month: '',
        round_day: '',
        adults: values.travellers,
        childs: values.childs,
        infants: values.infants,
        class_type: values.preferredClass,
        travel_type: 'oneway',
        max_result: 100,
      };
      dispatch(updateForm({
        flyingFrom: values.flyingFrom,
        flyingTo: values.flyingTo,
        departureDate: values.departureDate,
        travellers: values.travellers,
        childs : values.childs,
        infants: values.infants,
        preferredClass: values.preferredClass,
        flyingFromName: values.flyingFromName,
        flyingToName: values.flyingToName,
        
      }))
      dispatch(searchFlights(searchParams));
    },
  });

  const handleAirportSearch = (query, field) => {
    if (query.length > 2) {
      if (field === 'from') {
        console.log("handleAirportSearch from query",query)
        dispatch(fetchFromAirports(query));
      } else if (field === 'to') {
        dispatch(fetchToAirports(query));
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
          Flight Search
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              id="flyingFrom"
              name="flyingFrom"
              options={fromAirports}
              // options={optionFrom}
              // getOptionLabel={(option) => `${option.name} (${option.code})`}
              getOptionLabel={(option) => `${option.name}`}
              isOptionEqualToValue={(option, value) => { return option.code === value.code}}
              // value={"Netaji Subhash Chandra Bose International Airport, Kolkata, India (CCU)"}
              onChange={(event, newValue) => {
                formik.setFieldValue('flyingFrom', newValue ? newValue.code : '');
                formik.setFieldValue('flyingFromName', newValue ? newValue.name : '');
              }}
              onInputChange={(event, newInputValue) => {
                handleAirportSearch(newInputValue, 'from');
              }}
              loading={fromAirportsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Flying From"
                  error={formik.touched.flyingFrom && Boolean(formik.errors.flyingFrom)}
                  helperText={formik.touched.flyingFrom && formik.errors.flyingFrom}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {fromAirportsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              id="flyingTo"
              name="flyingTo"
              options={toAirports}
              // options={optionTo}
              // getOptionLabel={(option) => `${option.name} (${option.code})`}
              getOptionLabel={(option) => `${option.name}`}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              // value={(formik.values.flyingTo !== undefined) ? formik.values.flyingTo : ""}
              onChange={(event, newValue) => {
                formik.setFieldValue('flyingTo', newValue ? newValue.code : '');
                formik.setFieldValue('flyingToName', newValue ? newValue.name : '');
              }}
              onInputChange={(event, newInputValue) => {
                handleAirportSearch(newInputValue, 'to');
              }}
              loading={toAirportsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Flying To"
                  error={formik.touched.flyingTo && Boolean(formik.errors.flyingTo)}
                  helperText={formik.touched.flyingTo && formik.errors.flyingTo}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {toAirportsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="departureDate"
              name="departureDate"
              label="Departure Date"
              type="date"
              value={formik.values.departureDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.departureDate && Boolean(formik.errors.departureDate)}
              helperText={formik.touched.departureDate && formik.errors.departureDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="travellers"
              name="travellers"
              label="Travellers"
              type="number"
              value={formik.values.travellers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.travellers && Boolean(formik.errors.travellers)}
              helperText={formik.touched.travellers && formik.errors.travellers}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="childs"
              name="childs"
              label="Childs (3-12yrs.)"
              type="number"
              value={formik.values.childs}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.childs && Boolean(formik.errors.childs)}
              helperText={formik.touched.childs && formik.errors.childs}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="infants"
              name="infants"
              label="Infants (0-2yrs)"
              type="number"
              value={formik.values.infants}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.infants && Boolean(formik.errors.infants)}
              helperText={formik.touched.infants && formik.errors.infants}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="preferredClass"
              name="preferredClass"
              label="Preferred Class"
              value={formik.values.preferredClass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.preferredClass && Boolean(formik.errors.preferredClass)}
              helperText={formik.touched.preferredClass && formik.errors.preferredClass}
              select
            >
              <MenuItem value="ECONOMY">Economy</MenuItem>
              <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
              <MenuItem value="BUSINESS">Business</MenuItem>
              <MenuItem value="FIRST">First</MenuItem>
            </TextField>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} container direction="row" justifyContent="center" alignItems="center">
              <Button color="primary" variant="contained" fullWidthi type="submit" disabled={flightsLoading}>
                {flightsLoading ? <>{'Searching Flights  '} <CircularProgress color="inherit" size={20} /></> : 'Search Flights'}
              </Button>
            </Grid>
            {/*flights.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="button"
                  onClick={() => navigate("/flight/list")}
                  disabled={flightsLoading}
                >
                  {flights.length} Flights List
                </Button>
              </Grid>
            )*/}
          </Grid>
        </Grid>
      </form>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={flightsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default FlightForm;
