import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/header';
import WhatWeDo from './Components/Home/WhatWeDo';
import Info from './Components/Home/info';
import SponsorLogo from './Components/Home/sponsorLogo';
import Footer from './Components/Footer/footer';
import Dashboard from './Components/DashBoard/Dashboard/dashboard';
import Login from "./Components/Login&Register/login";
import Register from "./Components/Login&Register/register"
import PersonalInfo from "./Components/Personal_Info/personal_Info";
import RequestListing from "./Components/DashBoard/Donations/RequestListing";
import Analytics from './Components/DashBoard/Profile/Analytics';
import About from './Components/About/about';
import GetInTouch from "./Components/GetInTouch/GetInTouch";
import GoogleMaps from './Components/DashBoard/Dashboard/GoogleMaps';
import DoctorRegistration from './Components/Login&Register/doctorreg';
import Doctorcertificate from './Components/Personal_Info/doctorcertupload'
import DoctorProfile from './Components/DashBoard/Donations/DoctorProfile';
import DiseasePage from './Components/DashBoard/Donations/Diseasepage';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header id="header" />
              <WhatWeDo id="whatwedo" />
              <Info />
              <SponsorLogo id="sponsors" />
              <Footer />
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard type="patient"/>} />
        <Route path="/dashboard" element={<Dashboard type="doctor"/>} />
        <Route path="/dashboard" element={<Dashboard  type="admin"/>} />
        <Route path="/login" element={<Login type="patient"/>} />
        <Route path="/login" element={<Login type="doctor"/>} />
        <Route path="/login" element={<Login type="admin"/>} />
        <Route path="/register" element={<Register type="patient" />} />
        <Route path="/register" element={<Register type="doctor" />} />
        <Route path="/register" element={<Register type="admin" />} />
        <Route path="/doctor_reg" element={ <DoctorRegistration/>} />
        <Route path="/doctor_reg_cert" element={ <Doctorcertificate/>} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/doctor/:userId" element={<DoctorProfile />} />
        <Route path="/disease/:diseaseId" element={<DiseasePage/>} />
        

        <Route path="/new-request" element={<RequestListing />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/map" element={<GoogleMaps />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<GetInTouch />} />


      </Routes>
    </Router>
  );
}

export default App;