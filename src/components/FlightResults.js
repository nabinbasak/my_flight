import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Typography, Card, CardContent, CircularProgress, CardActions, Button, Box, Divider } from '@mui/material';
import { addToCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import {clearStateFlightSearch} from "../slices/flightSearchSlice"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const FlightResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ isShow , setIsShow ] = React.useState({show:false,id:null})

  const { flights, loading, error } = useSelector((state) => state.flightSearch);

  const formData = useSelector((state) => state.form);

  const handleBookNow = (flight) => {
    dispatch(addToCart(flight));
  };

  const handleBack = () => {
    dispatch(clearStateFlightSearch())
    navigate("/");
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const handelShowHide = (id) => {
    if(isShow.id !== id){
      setIsShow((prev) => ({...prev,show: true,id:id}))
    }else{
      setIsShow((prev) => ({...prev,show: !isShow.show ,id:id}))
    }
  }

  const departureDateFormData = new Date(formData.departureDate)

  function newTimeFormat(arr){
    if(arr && Object.keys(arr).length === 2){
      let hrs = (arr.hour) ? (parseInt(arr.hour) < 10) ? "0"+arr.hour : arr.hour : "";
      let mins = (arr.minute) ? (parseInt(arr.minute) < 10) ? "0"+arr.minute : arr.minute : "";
      hrs = (hrs === "") ? "00" : hrs
      mins = (mins === "") ? "00" : mins
      return (hrs+":"+mins)
    }else{
      return ""
    }
  }

  function minutesToHHMM(minutes) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(remainingMinutes).padStart(2, '0');
      if(parseInt(formattedHours) >= 0 && parseInt(formattedMinutes) >=0){
        return `${formattedHours} hr ${formattedMinutes} mins`;
      }else{
        return ""
      }
  }

  function calculateDifferenceInMinutes(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    const differenceInMilliseconds = Math.abs(date2 - date1);

    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

    return differenceInMinutes;
  }

  function stopsToText(stops) {
    const stopWords = {
        1: 'One Stop',
        2: 'Two Stop',
        3: 'Three Stop',
        4: 'Four Stop',
        5: 'Five Stop',
        6: 'Six Stop',
        7: 'Seven Stop',
        8: 'Eight Stop',
        9: 'Nine Stop',
        10: 'Ten Stop'
    };
    if (stops in stopWords) {
        return stopWords[stops];
    }
    if (stops > 10) {
        return `${stops} Stops`; 
    }
    return '';
  }

    let segmentList = [];
    let stopLen = -1 
    let segment_time = 0
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Choose Your Preferred Flight
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button onClick={handleBack} variant="contained" color="secondary">
            <SearchIcon/> &nbsp; Make A New Search
          </Button>
        </Grid>
        
        {flights && flights?.flightSearchList?.availableFareList && flights.flightSearchList.availableFareList.length > 0 ?
          <Grid container sx={{ my: 5 }} >
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <Box display="flex" justifyContent="center">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography color="text.secondary" component="div">
                      <LocationOnIcon fontSize='large' color='primary'/> From Station
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formData.flyingFromName}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {departureDateFormData.toDateString()}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <Box display="flex" justifyContent="center">
                  <ArrowRightAltIcon fontSize="large" /> 
                  </Box>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <Box display="flex" justifyContent="center">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography color="text.secondary" component="div">
                      <LocationOnIcon fontSize='large' color='primary'/> To Station
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formData.flyingToName}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
            </Grid>
          : null }

        {flights && flights?.flightSearchList?.availableFareList && flights.flightSearchList.availableFareList.length > 0 ? (
          flights && flights.flightSearchList.availableFareList.map((flight, index) => { 
              let departureTimeOfDay = [];
              let departureTimeOfDayFinal = [];
              let arrivalTimeOfDay = [];
              let arrivalTimeOfDayFinal = [];

              let departureDate = [];
              let departureDateFinal = [];
              let arrivalDate = [];
              let arrivalDateFinal = [];

              let stateDate = "",
                  endDate="";

              let totalJourneyInMins = 0
              let flyingTimeInMinutes = 0
              segment_time = 0

              if(flight?.legList && flight.legList.length > 0){
                if(flight.legList[0]?.itineraryList && flight.legList[0]?.itineraryList.length > 0){
                  if(flight.legList[0].itineraryList[0]?.segmentList && flight.legList[0].itineraryList[0].segmentList.length > 0){
                    stopLen = flight.legList[0].itineraryList[0].segmentList.length - 1
                    segmentList = flight.legList[0].itineraryList[0].segmentList
                    flyingTimeInMinutes = flight.legList[0].itineraryList[0].flyingTimeInMinutes
                  }
                }
              }

              
                segmentList.forEach((sList) => {
                  departureTimeOfDay.push(sList.departureTimeOfDay)
                  arrivalTimeOfDay.push(sList.arrivalTimeOfDay)
                  departureDate.push(sList.departureDate)
                  arrivalDate.push(sList.arrivalDate)
                  segment_time = parseInt(sList.segment_time) 
                })
             
            // console.log("Flight "+index+" : ",(stopLen))
            // console.log("departureTimeOfDay : ",departureTimeOfDay," arrivalTimeOfDay : ",arrivalTimeOfDay)  
            
              if(departureTimeOfDay && departureTimeOfDay.length > 0){
                departureTimeOfDayFinal = departureTimeOfDay[0]
                departureDateFinal = departureDate[0]
              }

              if(arrivalTimeOfDay && arrivalTimeOfDay.length > 0){
                arrivalTimeOfDayFinal = arrivalTimeOfDay[arrivalTimeOfDay.length-1]
                arrivalDateFinal = arrivalDate[arrivalDate.length-1]
              }

              if(departureDateFinal && Object.keys(departureDateFinal).length === 3){
                stateDate = departureDateFinal.year+"-"+departureDateFinal.month+"-"+departureDateFinal.day+" "+newTimeFormat(departureTimeOfDayFinal)+":00"
              }
              if(arrivalDateFinal && Object.keys(arrivalDateFinal).length === 3){
                endDate = arrivalDateFinal.year+"-"+arrivalDateFinal.month+"-"+arrivalDateFinal.day+" "+newTimeFormat(arrivalTimeOfDayFinal)+":00"
              }

              totalJourneyInMins = (stopLen === 0) ? flyingTimeInMinutes : calculateDifferenceInMinutes(stateDate,endDate)  
            
            // console.log("departureTimeOfDayFinal : ",departureTimeOfDayFinal," arrivalTimeOfDayFinal : ",arrivalTimeOfDayFinal) 
            // console.log("flyingTimeInMinutes : ",flyingTimeInMinutes," segment_time : ",segment_time,(flyingTimeInMinutes+segment_time))     
            
            return (
              <>
            {/* <Grid item xs={12} sm={6} md={4} lg={3} key={flight.fareId}> */}
            <Grid item xs={12} sm={12} md={12} lg={12} key={flight.fareId}>
              <Card>
                <CardContent>
                <Grid container sx={{ my: 5 }} >
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <Box display="flex" justifyContent="center">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography  component="div" fontWeight={"bold"}>
                        {newTimeFormat(departureTimeOfDayFinal)}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {formData.flyingFrom}
                      </Typography>
                      
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <Box display="flex" justifyContent="center">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <ArrowRightAltIcon fontSize="large" /> 
                     <b> {minutesToHHMM(totalJourneyInMins)} </b> &nbsp;<FiberManualRecordIcon fontSize='small'/>&nbsp; {(stopLen === 0) ? "Non Stop" : stopsToText(stopLen)}
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <Box display="flex" justifyContent="center">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography   component="div" fontWeight={"bold"}>
                        {newTimeFormat(arrivalTimeOfDayFinal)}
                      </Typography>
                      <Typography variant="h6" component="div" >
                        {formData.flyingTo}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                    <Typography variant="h5" component="div">
                    {/* £ */}
                     {flights.userPrefferedCurrencySymbol}  {flight?.passengerTypeFareList[flight?.passengerTypeFareList.length-1]?.grand_total}
                    </Typography>
                    <Typography component="div">
                      <Button size="small" onClick={() => handleBookNow({...flight,flyingFrom:formData.flyingFrom,flyingTo:formData.flyingTo,dTime:newTimeFormat(departureTimeOfDayFinal),aTime:newTimeFormat(arrivalTimeOfDayFinal),date:departureDateFormData })} variant="contained" color='warning'>Select</Button>
                    </Typography>
                  </Box>
              </Grid>
            </Grid>

            {stopLen > 0 ? <Button size="small" onClick={() => handelShowHide(flight.fareId)}>{(isShow.show && isShow.id === flight.fareId) ? "Hide Details" : "Show Details"}</Button> : null}  
            

            {isShow.show && isShow.id === flight.fareId && stopLen > 0 && segmentList && segmentList.length > 0 && segmentList.map((sList, index) => { 
                const departureDate = new Date(sList?.departureDate?.year+"-"+sList?.departureDate?.month+"-"+sList?.departureDate?.day)
                const arrivalDate = new Date(sList?.arrivalDate?.year+"-"+sList?.arrivalDate?.month+"-"+sList?.arrivalDate?.day)
              return (
                <>
                <Divider sx={{ my: 2 }} />
                  <Typography  component="span" color={"primary"}>
                    Depart
                  </Typography>
                  <Typography  component="span" >
                    &nbsp; &nbsp; {sList?.departure?.iata} - {sList?.destination?.iata}
                  </Typography>
                  <Typography  component="div" >
                    {(departureDate.toDateString() === "Invalid Date") ? "" : departureDate.toDateString()} <HorizontalRuleIcon/> {sList?.cabinClass} <HorizontalRuleIcon/> {minutesToHHMM(sList?.segment_time)}
                  </Typography>
                  <Typography  component="span" >
                    &nbsp; 
                  </Typography>

                  <Grid container sx={{ mb: 2,pt : 2 }} style={{"background":"#efefef"}}>

                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                      <Typography variant="h5" component="div">
                      {sList?.operatingAirline?.name}
                      </Typography>
                      <Typography component="div">
                      {sList?.flightNumber}
                      </Typography>
                    </Box>
                  </Grid> 

                  <Grid item xs={3} sm={3} md={3} lg={3} >
                    <Box display="flex" justifyContent="center" >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography  component="div" fontWeight={"bold"}>
                          {(departureDate.toDateString() === "Invalid Date") ? "" : departureDate.toDateString()}
                        </Typography>
                        <Typography  component="div" fontWeight={"bold"}>
                          {newTimeFormat(sList?.departureTimeOfDay)}
                        </Typography>
                        <Typography variant="h6" component="div">
                          {sList?.departure?.iata}
                        </Typography>
                        
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Box display="flex" justifyContent="center">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ArrowRightAltIcon fontSize="large" /> 
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <Box display="flex" justifyContent="center">
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography   component="div" fontWeight={"bold"}>
                          {(arrivalDate.toDateString() === "Invalid Date") ? "" : arrivalDate.toDateString()}
                        </Typography>
                        <Typography  component="div" fontWeight={"bold"}>
                          {newTimeFormat(sList?.arrivalTimeOfDay)}
                        </Typography>
                        <Typography variant="h6" component="div" >
                          {sList?.destination?.iata}
                        </Typography>
                      </Grid>
                    </Box>
                  </Grid>

                </Grid> 

                {(segmentList.length === (index+1)) ? <Divider sx={{ my: 2 }} /> : null }
                
                  </>
                )

              })}  


                </CardContent>
                <CardActions>
                  {/* <Button size="small" onClick={() => handleBookNow(flight)}>Select</Button> */}
                </CardActions>
              </Card>
            </Grid>
            </>)

          })
        ) : (
          <Grid item xs={12}>
            <Typography>No flights found</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default FlightResults;
