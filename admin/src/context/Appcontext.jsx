import { createContext } from "react";

export let AppContext = createContext();

let AppContextProvider = (props) => {
    let currency='$'
  let caluculateage = (dob) => {
    let today = new Date();
    let birthdate = new Date(dob);

    let age = today.getFullYear() - birthdate.getFullYear();
    return age;
  };
  let months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let slotdateformat = (slotdate) => {
    let datearray = slotdate.split("_");
    return (
      datearray[0] + " " + months[Number(datearray[1])] + " " + datearray[2]
    );
  };

  let value = {
    caluculateage,slotdateformat,currency
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
