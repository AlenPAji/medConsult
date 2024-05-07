import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { useNavigate } from "react-router-dom";

const Doctorvalidating = () => {
  // Sample pending doctors data (replace with actual data)
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const navigate = useNavigate();
  


  useEffect(() => {
    // Create a reference to the "doctor" collection in the database
    const db = getDatabase();
    const doctorsRef = ref(db, 'doctors');
    // Create a query to filter doctors where "verified" is false
    const pendingDoctorsQuery = query(doctorsRef, orderByChild('verified'), equalTo(false));
    //console.log(pendingDoctorsQuery)

    // Listen for changes to the data matching the query
    onValue(pendingDoctorsQuery, (snapshot) => {
      const pendingDoctorsData = snapshot.val();
      console.log("inside if",pendingDoctorsData)

      if (pendingDoctorsData) {
        // Convert the object to an array
        const pendingDoctorsArray = Object.values(pendingDoctorsData);
        setPendingDoctors(pendingDoctorsArray);
      } else {
        setPendingDoctors([]); // Set an empty array if no data matches the query
      }
    });

    // Clean up the listener when the component unmounts
   
  }, []);

  const handleViewMoreClick = (doctorId) => {
    // Navigate to another page, passing doctorId as a parameter
    navigate(`/doctor/${doctorId}`); // Assuming you have a route like '/doctor/:id'
  };

  

  

  return (
    
    <div>
     
      <h2>Pending Doctor Verification</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingDoctors.map(doctor => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.first_name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.status}</td>
              <td><button onClick={() => handleViewMoreClick(doctor.user_id)}>View More</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Doctorvalidating;
