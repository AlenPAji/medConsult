import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigateSidebar from '../Sidebar/NavigateSidebar';
import RequestListing from '../Donations/RequestListing';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import Footer from '../../Footer/footer';
import GoogleMaps from './GoogleMaps';
import Metrics from './Metrixs';
import '../../css/dashboard.css';
import DoctorValidating from '../Donations/Doctorvalidating';
import DoctorPatient from '../Donations/Doctoropatient';

export default function Dashboard() {
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [selectedLocationLat, setSelectedLocationLat] = useState(null);
    const [selectedLocationLng, setSelectedLocationLng] = useState(null);
    const [type, setType] = useState("")
    const [verified,setVerification]=useState("")
    const[specialization,setSpecialization]=useState("")

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setType(searchParams.get("type"));
        console.log(searchParams.get("type"))
      }, [location.search]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                setUser(user);
            } else {
                // No user is signed in.
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate, setUser]);

    useEffect(() => {
        // Listen for changes in authentication state
        const auth = getAuth();
        const db = getDatabase(); // Moved database reference outside the conditional block
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                let userRef; // Declare userRef variable here
                if (type === "doctor") {
                    userRef = ref(db, `doctors/${user.uid}`);
                        //console.log(userRef.verified);
                } else {
                    userRef = ref(db, `users/${user.uid}`);
                }

                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (type==='doctor') {
                        console.log(userData.verified);
                        setVerification(userData.verified)
                        setSpecialization(userData.specialization)
                    }

                    console.log(userData);
                    if (userData && userData.first_name) {
                        setUserName(capitalizeFirstLetter(userData.first_name));
                        console.log(userData.account_type)
                        setUserRole(capitalizeFirstLetter(userData.account_type));

                    }
                });
            } else {
                setUserId(null);
                setUserName(null);
            }
        });
        return () => unsubscribe();
    }, [type]);

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleLocationClick = (lan, lng) => {
        setSelectedLocationLat(lan);
        setSelectedLocationLng(lng);
    };

    return (
        <div className="container-fluid m-0 p-0">
            <div className="container-fluid row p-0">
                {/* Sidebar */}
                <NavigateSidebar userName={userName} />

                <div className="col-10">
                    <p className="lead d-none d-sm-block pt-2 text-secondary"><strong>Overview</strong>
                    </p>

                    {/* Metrics */}
                    <Metrics />
                    <hr />

                    {userRole === 'Admin' ? (
                        <DoctorValidating />
                    ) : userRole === 'Doctor' ? (
                        <DoctorPatient verified={verified} specialization={specialization}/>
                    ) : userRole === 'Patient' ? (
                        <RequestListing dashboardView={true} handleLocationClick={handleLocationClick} />
                    ) : (
                        <div>User role not recognized</div>
                    )}

                  
                </div>
            </div>

            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}
