import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue,update  } from 'firebase/database';
import '../../css/doctorprofile.css'
const DoctorProfile = () => {
  const { userId } = useParams(); // Assuming userId is part of the URL params
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor details from Firebase based on userId
    console.log(userId)
    const db = getDatabase();
    const doctorRef = ref(db, `doctors/${userId}`);

    onValue(doctorRef, (snapshot) => {
      const doctorData = snapshot.val();
      if (doctorData) {
        setDoctor(doctorData);
      }
    });
  }, [userId]);

  const handleApproveApplication = () => {
    // Update the doctor's data in Firebase to mark their application as approved
    const db = getDatabase();
    const doctorRef = ref(db, `doctors/${userId}`);

    update(doctorRef, {
      verified: true
    }).then(() => {
      // Update the local state to reflect the change
      setDoctor((prevDoctor) => ({
        ...prevDoctor,
        verified: true
      }));
      navigate(`/dashboard?type=admin`)
    }).catch((error) => {
      console.error('Error updating doctor data:', error);
    });
  };

  return (
    <div>
     
      {doctor && (
        <div className="doctor-profile-container">
        <h1>Doctor Profile</h1>
        {doctor && (
          <div className="doctor-profile-details">
            <div className="certificate-container">
              <img src={doctor.image_url} alt="Certificate" className="certificate-image" />
            </div>
            <div className="details-container">
              <p><strong>Name:</strong> {doctor.first_name} {doctor.last_name}</p>
              <p><strong>Gender:</strong> {doctor.gender}</p>
              <p><strong>Location:</strong> {doctor.location}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              {/* Add more fields as needed */}
            </div>
            <div className="approve-button-container">
            {!doctor.verified && (
              <button className="approve-button" onClick={handleApproveApplication}>
                Approve Application
              </button>
            )}
          </div>
          </div>
          
        )}
      </div>
      )}
    </div>
  );
};

export default DoctorProfile;
