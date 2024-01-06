import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, set, push, remove, onValue, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';
import Header from './Header';
import Footer from './Footer';
import imageCompression from 'browser-image-compression';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function CommonPage({ databasePath, storagePath, pageTitle }) {
  const [newProduct, setNewProduct] = useState({ name: '', desc: '', photo: '', price: '' });
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState({ name: '', desc: '', photo: '', price: '' });
  const [showModal, setShowModal] = useState(false);
  const [showModifyDeleteModal, setShowModifyDeleteModal] = useState(false);
  const [showModifyFields, setShowModifyFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { currentUser, additionalUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const isAdmin = currentUser && additionalUserInfo?.role === 'admin';
console.log("HI"+isAdmin);
  useEffect(() => {
    console.log(databasePath);
    console.log(storagePath);
    const database = getDatabase();
    const productsRef = ref(database, databasePath);
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.keys(data).map(key => ({...data[key], id: key}));
        setProducts(productList);
      } else {
        setProducts([]);
      }
    });
  }, [databasePath]);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (file, productId) => {
    if (!file) {
      console.error("No file provided for upload.");
      return null;
    }
    let compressedFile; 
    // Image compression options
    const options = {
      maxSizeMB: 1, // (Max file size in MB)
      maxWidthOrHeight: 1920, // (Compressed file max width or height)
      useWebWorker: true
    };

    try {
       compressedFile = await imageCompression(file, options);
    } catch (compressionError) {
      console.error("Error compressing the file:", compressionError);
      return null;
    }

    try {
      const storage = getStorage();
      const storageLocation = storageRef(storage, `${storagePath}/${productId}`);
      await uploadBytes(storageLocation, compressedFile);
      return await getDownloadURL(storageLocation);
    } catch (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = e.target.elements["productPhoto"].files[0];

    const database = getDatabase();
    const newProductRef = push(ref(database, databasePath));
    console.log(databasePath);
    const newProductId = newProductRef.key;

    let photoURL = "null"; // Default to null if no file is selected

    // Only attempt to upload if a file is selected
    if (file) {
        photoURL = await handleFileUpload(file, newProductId);
        if (!photoURL) {
            console.error("Photo upload failed.");
            return; // Exit the function if the photo upload fails
        }
    }
console.log(photoURL)
    // Create the new product with either the photo URL or null
    await set(newProductRef, {
        ...newProduct,
        id: newProductId,
        photo: photoURL
    });

    // Reset form and state after successful submission
    setNewProduct({ name: "", desc: "", photo: "", price: "" });
    setShowModal(false);
};
const handleSaveChanges = async () => {
    if (!selectedProductId) return;
  
    try {
      const database = getDatabase();
      const storage = getStorage();
      const productRef = ref(database, `${databasePath}/${selectedProductId}`);
      const fileInput = document.querySelector('[name="modifyProductPhoto"]');
      const file = fileInput.files[0];
      let updatedProductDetails = { ...selectedProductDetails };
  
      // If there's a file to upload and an existing photo, delete the old photo first
      if (file && updatedProductDetails.photo) {
        const oldPhotoRef = storageRef(storage, updatedProductDetails.photo);
        await deleteObject(oldPhotoRef).catch(error => console.error("Error deleting old photo:", error));
      }
  
      // Upload the new photo and update the product details
      if (file) {
        const newPhotoURL = await handleFileUpload(file, selectedProductId);
        console.log(newPhotoURL);
        if (newPhotoURL) {
          updatedProductDetails.photo = newPhotoURL;
        }
      }
  
      // Update product details in the database
      await set(productRef, updatedProductDetails);
  
      setSuccessMessage('Product updated successfully.');
      setShowModifyFields(false);
      setTimeout(() => setSuccessMessage(''), 3000);
  
      // Reset the file input for future uploads
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error updating product: ", error);
      setSuccessMessage('Error updating product.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  const handleProductSelection = async (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
  
    if (productId) {
        const database = getDatabase();
        const productRef = ref(database, `${databasePath}/${productId}`);
        onValue(productRef, (snapshot) => {
            const data = snapshot.val();
            setSelectedProductDetails(data || {});
        });
        setShowModifyFields(true);
    } else {
        setSelectedProductDetails({
            name: '',
            desc: '',
            photo: '',
            price: ''
        });
        setShowModifyFields(false);
    }
  };
  const handleDeleteProduct = async () => {
    if (!selectedProductId) return;
  
    try {
      const database = getDatabase();
      const productRef = ref(database, `${databasePath}/${selectedProductId}`);
      // Retrieve the current product details
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const productData = snapshot.val();
  
        // If there's a photo URL, delete the photo from storage
        if (productData.photo) {
          const storage = getStorage();
          const photoRef = storageRef(storage, productData.photo);
          await deleteObject(photoRef).catch((error) =>
            console.error("Error deleting photo:", error)
          );
        }
      }
      await remove(productRef);
  
      // Optionally, add logic to handle UI changes after deletion
  
      // Clear selected product details and close modal
      setSelectedProductDetails({ name: "", desc: "", photo: "", price: "" });
      setShowModifyFields(false);
      setSelectedProductId(null);
  
      // Show success message or refresh the product list
    } catch (error) {
      console.error("Error deleting product: ", error);
      // Handle error (e.g., show error message)
    }
  };
  // ... other handlers (handleSubmit, handleSaveChanges, handleProductSelection, handleDeleteProduct)

  return (
    <div className="main-content-container">
      <Header />
      <main className="content">
        <h1 id="content-h">{pageTitle}</h1>
        <section className="latest">
        <div className="product-intro">
    {isAdmin  && (
     <>
    <div className="admin-upload">
   
        <button onClick={() => {
          setShowModal(true);
          setShowModifyDeleteModal(false);
          console.log(showModal)
        }
          
          }>Upload Product</button>
    </div>
     <div className="admin-delete">
     <button onClick={() => {
      setShowModifyDeleteModal(true);
    setShowModal(false);
}}>
    Modify/Delete Product
</button>
    
 </div>
 </>
)}
      
    </div>
    <div className="card-container">
    {products.length === 0 ? (
              <div className="no-products-message">
                We are on this!
              </div>
            ) :(
              products.map((product) => (
                <div
                  className="card"
                  key={product.id}
              
                 onClick={() => navigate(`/category/${databasePath}/${product.id}`)}
                >
                 <div>
        <LazyLoadImage
          src={product.photo !== "null" ? product.photo : "./imgna.png"}
          alt={product.name}
          effect="blur"
        />
      </div>
                  <h1>{product.name}</h1>
                  <p className="product-description">{product.desc}</p>
                  {pageTitle !== 'Offers' && (
        <p className="priceHP">{product.price} INR</p>
      )}
                  
               
                </div>
              ))
            )}
            

            {showModal && (
              <div className="modal-two">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                  />
                  <textarea
                    name="desc"
                    value={newProduct.desc}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    name="productPhoto"
                    onChange={handleFileUpload}
                  />
                  <br />
                  <br />

                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />
                  <button type="submit">Add Product</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
            {showModifyDeleteModal && (
              <div className="modal-md">
                <form>
                  <select
                    className="form-select"
                    onChange={handleProductSelection}
                  >
                    <option value="">Select a Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {/* Add more form elements for modification */}
                  {showModifyFields && selectedProductDetails && (
                    <div className="product-modify-fields">
                      <div className="product">
                        <input
                          type="text"
                          value={selectedProductDetails.name}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              name: e.target.value,
                            })
                          }
                          placeholder="Product Name"
                        />
                        <textarea
                          value={selectedProductDetails.desc}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              desc: e.target.value,
                            })
                          }
                          placeholder="Description"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          name="modifyProductPhoto"
                        />
                        <input
                          type="number"
                          value={selectedProductDetails.price}
                          onChange={(e) =>
                            setSelectedProductDetails({
                              ...selectedProductDetails,
                              price: e.target.value,
                            })
                          }
                          placeholder="Price"
                        />

                        <button type="button" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}

                  <button type="button" onClick={handleDeleteProduct}>
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModifyDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>

        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CommonPage;
