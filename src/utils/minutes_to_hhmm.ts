import moment from "moment";

export default function minutes_to_hhmm (numberOfMinutes: number, blink = false) {
  //create duration object from moment.duration  
  const duration = moment.duration(numberOfMinutes, 'minutes');
  
  //calculate hours
  const hh = (duration.years()*(365*24)) + (duration.months()*(30*24)) + (duration.days()*24) + (duration.hours());
  
  //get minutes
  const mm = duration.minutes();
  
  // set minutes in string
  let minutes = mm.toString();

  // check if number is minor than 10 and concat a zero in the left
  if (mm < 10) { minutes = `0${mm}`; }

  // verify if minutes is to blink or not
  if (blink) {
    //return total time in hh mm format
    return `${hh} ${minutes}`;
  } else {
    //return total time in hh:mm format
    return `${hh}:${minutes}`;
  }
  
}