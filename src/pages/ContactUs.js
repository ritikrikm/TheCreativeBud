import React, { useState, useEffect } from "react";
import '../styling/contact.css'
import { getDatabase, ref, get } from "firebase/database";
import emailjs from "emailjs-com"; 
import { Helmet } from 'react-helmet';
const ContactUs = ({ onClose, uid }) => {

  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const maxWords = 1000;

  useEffect(() => {
  
  console.log("HELLO")

    if (uid) {
      const database = getDatabase();
      const userDataRef = ref(database, `users/${uid}`);
      console.log("HI")
      get(userDataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setEmail(userData.email || "");
            setContactNo(userData.contactNo || "");



          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [uid]);


  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (contactNo && !/^\d+$/.test(contactNo)) {
      newErrors.contactNo = "Invalid contact number";
    }


    if (!subject) {
      newErrors.subject = "Subject is required";
    }

    if (!message) {
      newErrors.message = "Message is required";
    } else if (countWords(message) > maxWords) {
      newErrors.message = `Message must be ${maxWords} words or fewer`;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const countWords = (text) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const handleSend = () => {
    if (validateForm()) {
      // Define your EmailJS parameters
      const serviceID = "service_wngz5nb";
      const templateID = "template_037tsuc";
      const userID = "obgkMsox4AvZeyi2C";

      // Use the EmailJS send function to send the email
      emailjs.send(serviceID, templateID, {
        email,
        contactNo,
    

        subject,
        message
      }, userID)
        .then(function (response) {
          console.log("Email sent successfully", response);
        })
        .catch(function (error) {
          console.error("Error sending email:", error);
        });

      alert("Enquiry successfully sent to the admin");

      // Reset the form fields
      setContactNo("");
      setSubject("");
      setMessage("");
    }
  };

  return (
    
    <div className="user-profile">
      <Helmet>
    <meta name="description" content="Get in touch with TheCreativeBud for any queries or support. We are here to help you with your orders, feedback, or any questions you might have." />
</Helmet>

      <h2>Enquiry Form</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email:<span className="asteriskColor">*</span></label>
          <input
            type="email"
            id="email"
            value={email}
            
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="contactNo">Contact No:</label>
          <input
            type="tel"
            id="contactNo"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
          />
          {errors.contactNo && <p className="error">{errors.contactNo}</p>}
        </div>

        
        <div className="form-group">
          <label htmlFor="subject">Subject:<span className="asteriskColor">*</span></label>
          <select
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select Option</option>
            <option value="payment">Payment Related Issues</option>
            <option value="OrderIssue">Order Issue</option>

            <option value="other">Other</option>
          </select>
          {errors.subject && <p className="error">{errors.subject}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:<span className="asteriskColor">*</span></label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="2"
            cols="50"
            placeholder=" upto 1000 words max"
          />
          {errors.message && <p className="error">{errors.message}</p>}
        </div>

        <button type="button" onClick={handleSend}>
          Send
        </button>

      </form>
    </div>
  );
};

export default ContactUs;
