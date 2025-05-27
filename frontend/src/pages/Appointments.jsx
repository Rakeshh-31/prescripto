import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import Relateddoctors from "../components/Relateddoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  let { docId } = useParams();
  let { doctors, currencysymbol, backendurl, token, getdoctorsdata } =
    useContext(Appcontext);

  let daysofweek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  let navigate = useNavigate();

  let [docInfo, setdocInfo] = useState(null);
  let [docslot, setdocslot] = useState([]);
  let [slotindex, setslotindex] = useState(0);
  let [slottime, setslotime] = useState("");

  let fetchDocInfo = async () => {
    let docInfo = doctors.find((doc) => doc._id === docId);
    setdocInfo(docInfo);
    if (docInfo) {
      getavailableslots(docInfo); // Pass docInfo correctly
    }
  };

  let getavailableslots = async (docInfo) => {
    if (!docInfo || !docInfo.slots_booked) {
      console.warn("docInfo or slots_booked is missing.");
      return;
    }

    setdocslot([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentdate = new Date(today);
      currentdate.setDate(today.getDate() + i);

      let endtime = new Date();
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentdate.getDate()) {
        let minutes = today.getMinutes();
        let roundedminutes =
          minutes % 30 === 0 ? minutes : minutes + (30 - (minutes % 30));
        currentdate.setHours(today.getHours(), roundedminutes, 0, 0);

        if (currentdate.getHours() < 10) {
          currentdate.setHours(10, 0, 0, 0);
        }
      } else {
        currentdate.setHours(10, 0, 0, 0);
      }

      let timeslots = [];
      while (currentdate < endtime) {
        let formattedtime = currentdate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentdate.getDate();
        let month = currentdate.getMonth() + 1;
        let year = currentdate.getFullYear();
        let slotdate = `${day}_${month}_${year}`;
        let slottime = formattedtime;

        let bookedSlots = docInfo.slots_booked?.[slotdate] || [];
        let isslotavailable = !bookedSlots.includes(slottime);

        if (isslotavailable) {
          timeslots.push({
            datetime: new Date(currentdate),
            time: formattedtime,
          });
        }

        currentdate.setMinutes(currentdate.getMinutes() + 30);
      }
      setdocslot((prev) => [...prev, timeslots]);
    }
  };

  let bookappointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      let date = docslot[slotindex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let slotdate = `${day}_${month}_${year}`;

      let { data } = await axios.post(
        backendurl + "/api/user/book-appointment",
        { docId, slotdate, slottime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getdoctorsdata();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5f6fff] w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 p-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{docInfo.degree}-{docInfo.speciality}</p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About
                <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencysymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docslot.length > 0 &&
              docslot.map((item, index) => (
                <div
                  onClick={() => setslotindex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotindex === index
                      ? "bg-[#5f6fff] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docslot.length > 0 &&
              docslot[slotindex].map((item, index) => (
                <p
                  onClick={() => setslotime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slottime
                      ? "bg-[#5f6fff] text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookappointment}
            className="bg-[#5f6fff] text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        {/* Related Doctors */}
        <Relateddoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointments;
