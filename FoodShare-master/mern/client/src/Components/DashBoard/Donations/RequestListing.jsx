import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DonationHeader from "./DonationHeader";
import Footer from "../../Footer/footer";
import "../../css/RequestForm.css";
import "../../css/donationHeader.css";

const RequestListing = ({ dashboardView, handleLocationClick }) => {
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    expirationDate: "",
    foodType: "",
    foodQuantity: "",
    foodWeight: "",
    pickupDateTime: "",
  });
  const [tableData, setTableData] = useState([]);
  //console.log("tabledata",tableData)
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [x,setx]=useState(null)
  const [currentLocation, setCurrentLocation] = useState(null);

  const [symptoms, setSymptoms] = useState({
    fever: false,
    difficultyBreathing: false,
    fatigue: false,
    headache: false,
    skinIssue: false,
    chestPain: false,
  });


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSymptoms((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    // Listen for changes in authentication state
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user here", user.uid)
        setUserId(user.uid);
        
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          console.log(userData);
          if (userData && userData.account_type) {
            setUserRole(userData.account_type);
            setUserName(capitalizeFirstLetter(userData.first_name));
          }
        });
      } else {
        setUserId(null);
        setUserRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    // Only fetch data if userId is available
    if (userId) {
      console.log('user detected');
      
      const db = getDatabase();
      const requestsRef = ref(db, "donationRequests");
      
      // Fetch data from Firebase on component mount
      onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        if (data) {
          const requestsArray = Object.entries(data).map(
            ([requestId, requestData]) => ({
              requestId,
              ...requestData,
            })
          );
  
          // Apply filter based on status
          const filteredRequests = requestsArray.filter(
            (request) => request.status !== "received"&& request.userId === userId
          );
          console.log("12:", filteredRequests);
  
          setTableData(
            dashboardView ? filteredRequests.slice(-5) : requestsArray
          );
        }
      });
    } else {
      console.log('user not found');
      // Handle scenario where userId is not available
      // You may want to set tableData to an empty array or display a message
    }
  }, [dashboardView, userId]);
  



  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getStatusButtonText = (status) => {
    console.log(status);
    switch (status) {
      case "pending":
        return "Pending";
      case "received":
        return "Received";
      case "deliver":
        return "To Deliver";
      default:
        return "Unknown Status";
    }
  };

  const handleAccept = (requestId) => {
    if (userRole === "volunteer") {
      const db = getDatabase();
      const requestRef = ref(db, `donationRequests/${requestId}`);

      set(requestRef, {
        ...tableData.find((data) => data.requestId === requestId),
        status: "pending",
        deliveredBy: userId, // Save the user ID of the volunteer who accepted
      })
        .then(() => {
          const updatedTableData = tableData.map((data) => {
            if (data.requestId === requestId) {
              return { ...data, status: "pending", deliveredBy: userId };
            }
            return data;
          });

          setTableData(updatedTableData);
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    }
  };

  const handlePending = (requestId,meet_url, status) => {
    console.log("handlePending function called");
    if (userRole === "patient" && status === "pending") {
      const db = getDatabase();
      const requestRef = ref(db, `donationRequests/${requestId}`);

      // Update the status to "received" in the database
      set(requestRef, {
        ...tableData.find((data) => data.requestId === requestId),
        status: "received",
        receivedBy: userId, // Save the user ID of the recipient
      })
        .then(() => {
          // Remove the item from the local state only if it is a dashboard view
          if (dashboardView) {
            const updatedTableData = tableData.filter(
              (data) => data.requestId !== requestId
            );
            setTableData(updatedTableData);
            window.location.href = `https://meet.google.com/${meet_url}`;
          }

          alert("Delivery received! Status updated to received.");
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "location") {
      const [lan, lng] = value.split(",").map((coord) => coord.trim());
      setFormData((prevData) => ({
        ...prevData,
        location: { lan, lng },
      }));
      setCurrentLocation({ lan, lng });
      console.log(lan, lng);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleShowLocation = (lan, lng) => {
    // Open Google Maps with the specified location
    if (!dashboardView) {
      window.open(`https://www.google.com/maps?q=${lan},${lng}`, "_blank");
    }
    handleLocationClick(lan, lng);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    

    const db = getDatabase();
    const requestsRef = ref(db, "donationRequests");

    // Add the new data to the 'requests' node in Firebase
    const newRequestRef = push(requestsRef);
    const currentTime = new Date();

    // Filter out checked symptoms
    const checkedSymptoms = Object.keys(symptoms).filter(symptom => symptoms[symptom]);
    //console.log('hi',checkedSymptoms)

    console.log(e.target.elements.symptoms)
    // Extract relevant form data
    const formData = {
        description: e.target.elements.description.value,
        
        height: e.target.elements.height.value,
        bodyWeight: e.target.elements.bodyWeight.value,
        userId: userId,
        symptoms:checkedSymptoms,
        userRole: userRole,
        donatedBy: userId,
        deliveredBy: "",
        receivedBy: "",
        status: "deliver",
        time: currentTime.toISOString(),
    };



   
    // Set the new request data in Firebase
    set(newRequestRef, formData);

    // Reset the form data and hide the form
    e.target.reset();
    setShowForm(false);
};

  

  const columnsForDashboard = [
  
    "description",
    "symptoms",
    "time",
  ];

  const columnsForDonationsPage = [
    "title",
    "description",
    "expirationDate",
    "foodType",
    "foodQuantity",
    "foodWeight",
    "pickupDateTime",
  ];

  const displayedColumns = dashboardView
    ? columnsForDashboard
    : columnsForDonationsPage;
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="container-fluid pb-3">
      <div className="row">
        {!dashboardView && <DonationHeader />}
        <div className={"col-md-12 pt-3"}>
          {dashboardView && userRole == "patient" && (
            <h5
              className="title mb-3 text-secondary"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              my consultations
              {userRole === "patient" && (
                
                <button
                  className="btn btn-primary mb-3 mt-3"
                  onClick={() => setShowForm(true)}
                >
                  Intiate Consultation
                </button>
              )}
            </h5>
          )}
          {showForm && (
            <div className="form-popup">
              <div className="form-container">
                <form className="row g-3" onSubmit={handleFormSubmit}>
                  <div className="col-md-6">
                    <label htmlFor="inputDescription" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the donation"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={7}
                      className="form-control"
                    ></textarea>
                    <h2>Symptoms</h2>

                    <div>
                      <label>
                        <input
                          type="checkbox"
                          name="fever"
                          checked={symptoms.fever}
                          onChange={handleCheckboxChange}
                        />
                        Fever
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="difficultyBreathing"
                          checked={symptoms.difficultyBreathing}
                          onChange={handleCheckboxChange}
                        />
                        Difficulty Breathing
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="fatigue"
                          checked={symptoms.fatigue}
                          onChange={handleCheckboxChange}
                        />
                        Fatigue
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="headache"
                          checked={symptoms.headache}
                          onChange={handleCheckboxChange}
                        />
                        Headache
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="skinIssue"
                          checked={symptoms.skinIssue}
                          onChange={handleCheckboxChange}
                        />
                        Skin Issue
                      </label>
                      <br />
                      <label>
                        <input
                          type="checkbox"
                          name="chestPain"
                          checked={symptoms.chestPain}
                          onChange={handleCheckboxChange}
                        />
                        Chest Pain
                      </label>
                      <br />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="inputSymptomStartDate"
                      className="form-label mb-1 mt-2"
                    >
                      Symptom Start Date
                    </label>
                    <input
                      type="date"
                      name="symptomStartDate"
                      value={formData.symptomStartDate}
                      onChange={handleInputChange}
                      className="form-control"
                    />

                    <label
                      htmlFor="inputHeight"
                      className="form-label mb-1 mt-2"
                    >
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      placeholder="Enter height in cm"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />

                    <label
                      htmlFor="inputBodyWeight"
                      className="form-label mb-1 mt-2"
                    >
                      Body Weight
                    </label>
                    <input
                      type="text"
                      name="bodyWeight"
                      placeholder="Enter body weight in kg"
                      value={formData.bodyWeight}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  {/* Button */}
                  <div className="col-md-6">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="table-responsive " >
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <th>S.No</th>
                                {displayedColumns.map(column => (
                                    <th key={column}>
                                        {capitalizeFirstLetter(column)}
                                    </th>
                                ))}
                            </thead>
                            <tbody className='table-body'>
                                {tableData?.map((data, index) => (
                                    <tr key={index}>
                                        <td style={{ width: "50px" }}>{index + 1}</td>
                                        {displayedColumns.map(column => (
                                            <td key={column} style={{ width: "216px" }}>
                                                {data[column]}
                                            </td>
                                        ))}
                                        <td style={{ width: "216px" }}>
                                            {userRole === "volunteer" && (
                                                <div className="btn-group" role="group">
                                                    <button
                                                        type="button"
                                                        className={`btn ${data.status === "pending" ? "btn-warning" : "btn-primary"}`}
                                                        onClick={() => handleAccept(data.requestId)}
                                                        disabled={data.status === "pending"}

                                                    >
                                                        {getStatusButtonText(data.status)}
                                                    </button>
                                                </div>
                                            )}
                                            {userRole === "patient" && (
                                                <div className="btn-group" role="group">
                                                    {console.log('Button rendering')}
                                                    <button
                                                        type="button"
                                                        className={`btn ${data.status === "pending"
                                                            ? "btn-warning"
                                                            : data.status === "deliver"
                                                                ? "btn-primary"
                                                                : data.status === "received"
                                                                    ? "btn-success"
                                                                    : ""
                                                            }`}
                                                        onClick={() => handlePending(data.requestId,data.meet_url, data.status)}

                                                    >
                                                        {getStatusButtonText(data.status)}
                                                    </button>
                                                </div>
                                            )}
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
        </div>

        {!dashboardView && <Footer />}
      </div>
    </div>
  );
};

export default RequestListing;
