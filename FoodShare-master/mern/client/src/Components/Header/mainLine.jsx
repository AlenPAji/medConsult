import "../../App.css"
import { useNavigate } from 'react-router-dom';

export default function mainLine({ user, userRole }) {
    const navigate = useNavigate();

    const handleDonateClick = () => {
        console.log(userRole);

        if (user) {
            if (userRole === 'patient') {
                navigate("/dashboard");
            } else {
                navigate("/register");
                alert('Please register as a patient to make a consultation.');
                
            }
        } else {
            navigate("/login");;
        }
    }


    return (
        <div className="textBox">
            <h1>Med Consult</h1>
            <p>Treat you better always with you!</p>
            <button className="ExploreBtn" onClick={handleDonateClick}>
                Start Consultation
            </button>
        </div>
    )
}