import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import '../css/personal_Info.css';

import { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';


export default function PersonalInfo() {
    const [type, setType] = useState("");
   
    const navigate = useNavigate();
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setType(searchParams.get("type"));
        console.log(searchParams.get("type"))
      }, [location.search]);

    

      function writeUserData(userId, f_name, l_name, address, phone, gender,specialization, accType) {
        const db = getDatabase();
        if(specialization==null){
        set(ref(db, 'users/' + userId), {
            user_id: userId,
            first_name: f_name,
            last_name: l_name,
            location: address,
            phone: phone,
            gender: gender,
            account_type: accType,
        });
    }
    else{
        set(ref(db, 'doctors/' + userId), {
            user_id: userId,
            first_name: f_name,
            last_name: l_name,
            location: address,
            phone: phone,
            gender: gender,
            account_type: accType,
            specialization: specialization,
        });

    }
    }

    const handleProceed = async (e) => {
        e.preventDefault();
        const user = JSON.parse(window.localStorage.getItem('user'));
        console.log(user);
        let specialization = null;
        if (type === 'doctor') {
            specialization = document.getElementById('specialization').value;
        }
        const formData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            specialization,
            accType: document.getElementById('accType').value,
        };
        
        console.log(formData);
        try {
            writeUserData(
                user.uid,
                formData.firstname,
                formData.lastname,
                formData.address,
                formData.phone,
                formData.gender,
                formData.specialization,
                formData.accType,
            );
            //navigate condition for doctor and patient
            if (type=='doctor') {
                navigate('/doctor_reg_cert')
            }
            else{
                //check for error
                navigate(`/dashboard?type=${type}`)
            }
            

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="formbold-main-wrapper">
                <h1>Profile Information</h1>
                <div className="formbold-form-wrapper">
                    <form action="#" method="POST" onSubmit={handleProceed}>
                        <div className="formbold-input-flex">
                            <div>
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="Abdul"
                                    className="formbold-form-input"
                                />
                                <label htmlFor="firstname" className="formbold-form-label"> First name </label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder="Sameer"
                                    className="formbold-form-input"
                                />
                                <label htmlFor="lastname" className="formbold-form-label"> Last name </label>
                            </div>
                        </div>

                        <div className="formbold-input-flex">
                            <div>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    placeholder="Home, Street, area, etc."
                                    className="formbold-form-input"
                                />
                                <label htmlFor="address" className="formbold-form-label"> Address </label>
                                {/* <PlacesAutocomplete
                                    value={address}
                                    onChange={handleAddressChange}
                                    onSelect={handleAddressChange}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div>
                                            <input
                                                {...getInputProps({
                                                    placeholder: 'Enter your address',
                                                    className: 'formbold-form-input',
                                                })}
                                            />
                                            <div>
                                                {loading && <div>Loading...</div>}
                                                {suggestions.map((suggestion) => (
                                                    <div {...getSuggestionItemProps(suggestion)}>
                                                        {suggestion.description}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </PlacesAutocomplete> */}
                                {/* <label htmlFor="address" className="formbold-form-label">
                                    Address
                                </label> */}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="XXXX XXXXXXX"
                                    className="formbold-form-input"
                                />
                                <label htmlFor="phone" className="formbold-form-label"> Phone Number </label>
                            </div>
                        </div>

                        <div className="formbold-input-flex">
                            <div>
                                <select id="gender" className="formbold-form-input">
                                    <option value="Select Gender">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="unidentified">Prefer Not to say</option>
                                </select>
                                <label htmlFor="gender" className="formbold-form-label"> Gender </label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                   // name="firstname"
                                    id="accType"
                                    //placeholder="Abdul"
                                    value={type}
                                    className="formbold-form-input"
                                />
                                <label htmlFor="firstname" className="formbold-form-label"> Type </label>
                            </div>
                            {type === 'doctor' && (

                            <div>
                                <select id="specialization" className="formbold-form-input">
                                    <option value="Select Account Type">Select your specialization</option>
                                    <option value="Pediatritian">Pediatritian</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="General">General Medicine</option>
                                    <option value="Dermatology">Dermatology</option>
                                </select>
                                <label htmlFor="specialization" className="formbold-form-label"> Account Type </label>
                            </div>
                            )}

                            <div>
                                <input
                                    type="text"
                                   // name="firstname"
                                    id="age"
                                    //placeholder="Abdul"
                                    
                                    className="formbold-form-input"
                                />
                                <label htmlFor="firstname" className="formbold-form-label">Age</label>
                            </div>
                        </div>

                        <button type="submit" className="formbold-btn">Proceed</button>
                    </form>
                </div>
            </div>
        </>
    )
}
