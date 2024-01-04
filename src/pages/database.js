// src/UserData.js or a new service file
import { database } from './pages/firebase-config';
export const saveUserData = (userId, name, email) => {
  return database.ref('users/' + userId).set({
    name: name,
    email: email,
    // Do not save the password
  });
};