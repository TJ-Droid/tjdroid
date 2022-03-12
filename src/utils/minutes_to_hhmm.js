import moment from "moment";

export default function minutes_to_hhmm (numberOfMinutes, blink = false) {
  //create duration object from moment.duration  
  var duration = moment.duration(numberOfMinutes, 'minutes');
  
  //calculate hours
  var hh = (duration.years()*(365*24)) + (duration.months()*(30*24)) + (duration.days()*24) + (duration.hours());
  
  //get minutes
  var mm = duration.minutes();
  
  // check if number is minor than 10 and concat a zero in the left
  if (mm < 10) { mm = `0${mm}`; }

  // verify if minutes is to blink or not
  if (blink) {
    //return total time in hh mm format
    return `${hh} ${mm}`;
  } else {
    //return total time in hh:mm format
    return `${hh}:${mm}`;
  }
  
}