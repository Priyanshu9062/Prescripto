import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // Fetch doctor info
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const info = doctors.find(doc => String(doc._id) === String(docId));
      setDocInfo(info || null);
    }
  }, [doctors, docId]);

  // Generate slots
  const getAvailableSlots = async () => {
    if (!docInfo) return;

    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // Slots till 9 PM

      // Start time
      if (i === 0) {
        if (currentDate.getHours() < 10) {
          currentDate.setHours(10, 0, 0, 0);
        } else {
          const mins = currentDate.getMinutes();
          currentDate.setMinutes(mins <= 30 ? 30 : 0, 0, 0);
          if (currentDate.getMinutes() === 0) {
            currentDate.setHours(currentDate.getHours() + 1);
          }
        }
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    setSlotTime('');
  }, [slotIndex]);

  return (
    <div className="p-4 md:p-10">
      {docInfo ? (
        <>
          {/* Doctor Info */}
          <div className="flex flex-col sm:flex-row gap-8 p-6 bg-white rounded-xl shadow-md">
            <div className="flex-shrink-0">
              <img
                src={docInfo.image || '/placeholder.png'}
                alt={docInfo.name}
                className="bg-blue-50 border border-gray-300 w-52 h-52 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-4 sm:pl-8 sm:border-l sm:border-gray-300">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold">{docInfo.name}</p>
                <img src={assets.verified_icon} alt="verified" className="w-6 h-6" />
              </div>
              <div className="text-lg">
                <p>{docInfo.degree} - {docInfo.speciality}</p>
                <button className="mt-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-md text-base font-medium">
                  {docInfo.experience}
                </button>
              </div>
              <div className="text-lg">
                <p className="flex items-center gap-2 font-medium">
                  About <img src={assets.info_icon} alt="info" className="w-5 h-5" />
                </p>
                <p className="text-gray-600">{docInfo.about}</p>
              </div>
              <p>
                Appointment Fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
              </p>
            </div>
          </div>

          {/* Booking Slots */}
          <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
            <p>Booking Slots</p>
            {/* Day selector */}
            <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 no-scrollbar">
              {docSlots.map((item, index) => {
                const dayDate = item[0] ? item[0].datetime : new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000);
                return (
                  <div
                    key={index}
                    onClick={() => setSlotIndex(index)}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-full cursor-pointer transition-all duration-200
                      ${slotIndex === index ? 'primary text-black' : 'border border-gray-300 bg-white text-gray-700'}`}
                  >
                    <p className="font-medium">{daysOfWeeks[dayDate.getDay()]}</p>
                    <p className="text-lg font-semibold">{dayDate.getDate()}</p>
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
              <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
                {docSlots[slotIndex].map((item, index) => (
                  <p
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer
                      ${slotTime === item.time ? 'primary text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
              </div>
            ) : (
              <div className="mt-10 flex justify-start">
                <p className="text-gray-500 font-medium">No slots available for today</p>
              </div>
            )}

            <div>
              <button className='primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                Book an Appointment
              </button>
            </div>
          </div>

          {/* Related Doctors */}
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">Loading doctor information...</p>
      )}
    </div>
  );
};

export default Appointment;
