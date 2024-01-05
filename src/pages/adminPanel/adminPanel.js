import React, { useContext } from 'react';
import { UserContext } from '../UserContext'; // Adjust the path as necessary
import { database } from '../../firebase'; // Adjust the path as necessary
import { ref, update } from 'firebase/database';

const AdminPanel = () => {
  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const uid = currentUser ? currentUser.uid : null;
  const role = additionalUserInfo ? additionalUserInfo.role : '';

  const changeRole = async (newRole) => {
    if (!uid) {
      console.error("No UID found for the current user.");
      return;
    }

    const userRoleRef = ref(database, `users/${uid}`);
    try {
      await update(userRoleRef, { role: newRole });
      console.log(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div>
      <h1>Special Feature</h1>
      <p>This is the special feature page, accessible only to admins and users with permission.</p>
      {role === 'admin' && (
        <button onClick={() => changeRole('user')}>Switch to User Role</button>
      )}
      {role === 'user' && (
        <button onClick={() => changeRole('admin')}>Switch to Admin Role</button>
      )}
      {/* Add more content as needed */}
    </div>
  );
};

export default AdminPanel;
