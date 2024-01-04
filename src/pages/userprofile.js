import React, {  useState } from "react";

import { useContext } from 'react';
import { UserContext } from './UserContext';
const UserProfile = () => {


  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const uid = currentUser ? currentUser.uid : null;
  const name = additionalUserInfo ? additionalUserInfo.name : '';
  const email = additionalUserInfo ? additionalUserInfo.email : '';

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });


  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <form>
        <div className="form-group">
          <label htmlFor="firstname">Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            value={name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            readOnly
          />
        </div>
        
      </form>
    </div>
  );
};

export default UserProfile;
