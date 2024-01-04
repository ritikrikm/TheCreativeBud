import React, { useState } from "react";
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { getDatabase, ref, update } from "firebase/database";
import './updateprofile.css'; // Importing the CSS file



const UpdateProfile = () => {
  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const [nameError, setNameError] = useState('');
  const uid = currentUser ? currentUser.uid : null;
  const [fullName, setFullName] = useState(additionalUserInfo ? additionalUserInfo.name : '');
  console.log("MY FULL NANE"+fullName);

  const [newName, setName] = useState('');
  const email = additionalUserInfo ? additionalUserInfo.email : '';
  const [address1, setAddress1] =useState(additionalUserInfo ? additionalUserInfo.address1 : '');
  const [pinCode, setPinCode] =useState(additionalUserInfo ? additionalUserInfo.pinCode : '');
  const [city, setCity] = useState(additionalUserInfo ? additionalUserInfo.city : '');
  const [state, setState] = useState(additionalUserInfo ? additionalUserInfo.state : '');
  const [updateSuccess, setUpdateSuccess] = useState(false); 
  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });


  const handleNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handleStateChange = (event) => {
    setState(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handlePinChange = (event) => {
    setPinCode(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress1(event.target.value);
  };
  const saveUserData = () => {
    const db = getDatabase(); // Correct method to get the database reference
    const userRef = ref(db, 'users/' + uid); // Correct reference to your user data in Realtime Database
    const trimmedFullName = fullName.trim();
    if (trimmedFullName) {
      // Proceed with saving the user data
      // ... Your save logic here ...
  
      console.log("Saved:", trimmedFullName); // For demonstration
      update(userRef, {
        name: trimmedFullName,   
      
       
        
      }).then(() => {
        setUpdateSuccess(true); // Update the success state
        setTimeout(() => {
          window.location.reload(); // Refresh the page after a delay
        }, 3000); // Delay of 3 seconds before page refresh
        console.log("User data updated successfully.");
      }).catch((error) => {
        console.error("Error updating data: ", error);
        setUpdateSuccess(false);
      });
      // Optionally, clear the input field after saving
      setFullName("");
      setNameError('');
    } else {
      // Handle the case where fullName is empty or only spaces
      console.error("Name cannot be empty");
      setNameError('Name cannot be empty');
      // Optionally, show an error message to the user
    }
    
  };

  const saveUserData2 = () => {
    const db = getDatabase(); // Correct method to get the database reference
    const userRef = ref(db, 'users/' + uid); // Correct reference to your user data in Realtime Database

    update(userRef, {
     
      address1, // Add address fields to the update
      pinCode,
      city,
      state
      
    }).then(() => {
      setUpdateSuccess(true); // Update the success state
      setTimeout(() => {
        window.location.reload(); // Refresh the page after a delay
      }, 3000); // Delay of 3 seconds before page refresh
      console.log("User data updated successfully.");
    }).catch((error) => {
      console.error("Error updating data: ", error);
      setUpdateSuccess(false);
    });
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {updateSuccess && <div className="update-success-message">Update Successful!</div>}
        <div className="form-group">
          <label htmlFor="firstname">Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Name"
            value={fullName}
          onChange={(e) => setFullName(e.target.value)}
       
          />
          {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
          <button onClick={saveUserData}> Save</button>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email - (you can not change your email)</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email "
            value={email}
            
          />
        </div>
        <div className="address-box">
        {/* Address and City fields */}
        <div className="row">
          <div className="column">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              value={address1}
              onChange={handleAddressChange} // Add this line
            />
          </div>
          <div className="column">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={city}
              onChange={handleCityChange} // Add this line
            />
          </div>
        </div>

        {/* State and PinCode fields */}
        <div className="row">
          <div className="column">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              value={state}
              onChange={handleStateChange} // Add this line
            />
          </div>
          <div className="column">
            <label htmlFor="pinCode">Pin Code</label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              placeholder="Pin Code"
              value={pinCode}
              onChange={handlePinChange} // Add this line
            />
          </div>
        </div>

        {/* Save button */}
        <div className="button-container">
          <button onClick={saveUserData2}>Save</button>
        </div>
      </div>
  
    </div>
  );
};

export default UpdateProfile;
