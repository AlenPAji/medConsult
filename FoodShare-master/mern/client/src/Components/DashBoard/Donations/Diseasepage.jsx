import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue,update  } from 'firebase/database';
import '../../css/diseasestyle.css'
const DiseasePage = () => {
  const { diseaseId } = useParams(); // Assuming userId is part of the URL params
  const [patientData, setDoctor] = useState(null);
  const [showInputField, setShowInputField] = useState(false); 
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor details from Firebase based on userId
    console.log(diseaseId)
    const db = getDatabase();
    const doctorRef = ref(db, `donationRequests/${diseaseId}`);
    console.log(doctorRef)

    onValue(doctorRef, (snapshot) => {
      const doctorData = snapshot.val();
      if (doctorData) {
        console.log(doctorData)
        setDoctor(doctorData);
      }
    });
  }, [diseaseId]);

  // const handleApproveApplication = () => {
  //   // Update the doctor's data in Firebase to mark their application as approved
  //   const db = getDatabase();
  //   const doctorRef = ref(db, `doctors/${userId}`);

  //   update(doctorRef, {
  //     verified: true
  //   }).then(() => {
  //     // Update the local state to reflect the change
  //     setDoctor((prevDoctor) => ({
  //       ...prevDoctor,
  //       verified: true
  //     }));
  //     navigate(`/dashboard?type=admin`)
  //   }).catch((error) => {
  //     console.error('Error updating doctor data:', error);
  //   });
  // };
  const handleButtonClick = () => {
    // Toggle input field visibility
    setShowInputField(!showInputField);
  };

  const handleInputChange = (event) => {
    // Update input field value
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Handle form submission logic here, e.g., sending data to Firebase
    // For simplicity, let's just log the input value for now
    console.log("Submitted data:", inputValue);
    const db = getDatabase();
  const doctorRef = ref(db, `donationRequests/${diseaseId}`);

  const updates = {
    status: 'pending', // Update the status field
    meet_url: inputValue // Add the meet_url field with the inputValue
  };

  update(doctorRef, updates)
  .then(() => {
    console.log('Status and meet_url successfully updated in the database');
    // Clear the input field and hide it after submission
    setInputValue('');
    setShowInputField(false);
  })
  .catch((error) => {
    console.error('Error updating status and meet_url in the database:', error);
  });


    // Clear the input field and hide it after submission
    setInputValue('');
    setShowInputField(false);
  };

    return (
      <div className="disease-page-container">
        {patientData && (
          <div>
            <h2>Description</h2>
            <p>{patientData.description}</p>
  
            <h2>Body Weight</h2>
            <p>{patientData.bodyWeight}</p>
  
            <h2>Height</h2>
            <p>{patientData.height}</p>
  
            <h2>Symptoms</h2>
            <ul>
              {patientData.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
  
            <h2>Time (Symptom Start Date)</h2>
            <p>{patientData.time}</p>
  
            {/* Button to toggle input field */}
            <button onClick={handleButtonClick}>Attempt Now</button>
  
            {/* Input field */}
            {showInputField && (
            <form onSubmit={handleSubmit} className="input-field-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter your data here..."
              />
              <button type="submit">Submit</button>
            </form>
          )}
          </div>
        )}
      </div>
    );
  

 
};

export default DiseasePage;
