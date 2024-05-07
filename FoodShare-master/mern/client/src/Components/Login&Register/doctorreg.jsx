
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { getDatabase, ref, child, get } from 'firebase/database';
import './doctor.css';

const DoctorRegistration = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [certificate, setCertificate] = useState(null);

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
  };

  const handleCertificateChange = (event) => {
    const file = event.target.files[0];
    setCertificate(file);
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    // Upload certificate to Firebase Storage
    const storageRef = firebase.storage().ref();
    const certificateRef = storageRef.child(`certificates/${name}-${certificate.name}`);
    await certificateRef.put(certificate);

    // Additional logic for submitting other doctor details to database
    // ...

    // Clear form fields after submission
    setName('');
    setAge('');
    setSpecialization('');
    setCertificate(null);

    alert('Doctor registration successful!');
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      <form onSubmit={handleRegistrationSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Specialization:</label>
          <label>
            <input type="radio" value="pediatrician" checked={specialization === 'pediatrician'} onChange={handleSpecializationChange} />
            Pediatrician
          </label>
          <label>
            <input type="radio" value="general_medicine" checked={specialization === 'general_medicine'} onChange={handleSpecializationChange} />
            General Medicine
          </label>
          <label>
            <input type="radio" value="cardiology" checked={specialization === 'cardiology'} onChange={handleSpecializationChange} />
            Cardiology
          </label>
          <label>
            <input type="radio" value="pulmonary" checked={specialization === 'pulmonary'} onChange={handleSpecializationChange} />
            Pulmonary
          </label>
        </div>
        <div>
          <label>Upload Certificate:</label>
          <input type="file" onChange={handleCertificateChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegistration;
