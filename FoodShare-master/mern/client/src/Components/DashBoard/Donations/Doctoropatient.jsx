import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, startAt, onValue } from 'firebase/database';
import { useNavigate } from "react-router-dom";
import '../../css/doctorpatientstyle.css'

const DoctorPatient = ({verified,specialization}) => {
  // Sample pending doctors data (replace with actual data)
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Firebase Realtime Database reference
        const database = getDatabase();
        const usersRef = ref(database, 'donationRequests');
        // Reference to 'users' node
        //const usersRef = ref(database, 'users');

        // Perform a query to find patients with symptoms
        const queryRef = query(usersRef, orderByChild('userRole'), startAt('patient'));
        // Listen for value changes
        onValue(queryRef, (snapshot) => {
            const usersWithSymptoms = [];
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if(user.status!='pending'){
                const symptoms = user.symptoms || [];
                const hasHeadache = symptoms.includes('headache');
                const hasFatigue = symptoms.includes('fatigue');
                const hasFever = symptoms.includes('fever');

                if (hasHeadache || hasFatigue || hasFever) {
                    user.id = childSnapshot.key;
                    usersWithSymptoms.push(user);
                    
                    console.log(user)
                }
            }
            });

            // Update state with users having symptoms
            setPatients(usersWithSymptoms);
        });
    }, []);



  


 console.log(verified)
 console.log(specialization)

 
 const handleViewMoreClick = (diseaseId) => {
    // Navigate to another page, passing doctorId as a parameter
    navigate(`/disease/${diseaseId}`); // Assuming you have a route like '/doctor/:id'
  };

  

  return (
    <div>
        {verified ? (
            <div>
            <h2>Available Consultations</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map over 'patients' array */}
                    {patients.map((patient, index) => (
                        <tr key={index}>
                            <td>{patient.description}</td>
                            <td>{patient.status}</td>
                            <td>
                                <button onClick={() => handleViewMoreClick(patient.id)}>View More</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        ) : <div className="verification-pending-message">
        Waiting to get verified to begin consultation
    </div>}
    </div>
);
}

export default DoctorPatient;
