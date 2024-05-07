import React, { useState } from 'react';
import { storage } from '../../config/firebase-config';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import { getDatabase,ref as databaseRef,  set ,get} from "firebase/database";
import { useNavigate } from 'react-router-dom';

const ImageUpload = () => {
    const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [url,setUrl]=useState(null)

  const handleImageChange = (e) => {
    if(e.target.files[0]){
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    }
  };

  //console.log(image)

  const handleImageUpload = () => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    const db = getDatabase();
    const userId = user.uid;
    const userDataRef = databaseRef(db, 'doctors/' + userId);
    console.log('haaaaa',userDataRef)
    
    // You can implement your upload logic here
    console.log("Uploading image:", image);
    const imageRef=ref(storage,user.uid);
    uploadBytes(imageRef,image).then(()=>{
        getDownloadURL(imageRef).then((url)=>{
            setUrl(url)
            get(userDataRef).then((snapshot) =>{
                const userData = snapshot.val();
                set(userDataRef, {
                    ...userData,
                    image_url: url,
                    verified: false
                  }).then(() => {
                    console.log("User data updated with image URL.");
                    navigate(`/dashboard?type=doctor`)

                    
                  })
            })
            

           
            //console.log(url)
        }).catch(error=>{
            console.log(error)
        })
        setImage(null)
    }).catch(error=>{
        console.log(error)
    })
  };

  return (
    <div>
      <h2>Upload Doctor's License Certificate</h2>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={handleImageUpload}>Upload</button>
      </div>
      {image && (
        <div>
          <h4>Selected Image:</h4>
          <img src={URL.createObjectURL(image)} alt="Selected" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
