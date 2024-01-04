import { getDatabase, ref, get } from "firebase/database";
import { useAuth } from "./authcontext";

// Function to fetch user profile data from Firebase
export const fetchUserProfileData = async (uid, role) => {
  const database = getDatabase();
  let userRef;

  switch (role) {
    case "admin":
      userRef = ref(database, `admins/${uid}`);
      break;
    case "user":
      userRef = ref(database, `users/${uid}`);
      break;
    default:
      console.error("Invalid role:", role);
      return null;
  }

  try {
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      return {
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        country: userData.country || "",
        region: userData.region || "",
        gender: userData.gender || "",
        // Add other properties specific to each role here
      };
    } else {
      console.error("User data does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from Firebase:", error);
    throw error; // You may choose to handle the error differently
  }
};
