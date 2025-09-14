import React , {useState , useEffect} from 'react'
import ProfileImage from "../assets/profile-image.png"
import { Pencil, Save, SquarePen  } from "lucide-react"; 
import axios from "axios";
import { toast } from 'react-toastify';
import Modals from '../components/Modals'


const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";


const Profile = () => {

  const [userData , setUserData] = useState(null);
  const [token , setToken] = useState("");
  const [isEditing , setIsEditing] = useState({
    name : false,
    mobile : false,
  });

  const [formData , setFormData] = useState({
    name : userData?.name || "",
    mobile : userData?.mobile || "",
  });
  const [showImageCHangeModal , setShowImageChangeModal] = useState(false);


  const fetchUserDetails = async() => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/profile` , {
        headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
      });

      setUserData(response.data);
    } catch (error) {
      console.log("Error in fetching user details: ", error);
    }
  }


  useEffect(() => {
      const token = localStorage.getItem("token");
      const userFromStorage = localStorage.getItem("user");

      if(token && userFromStorage) {
          setToken(token);
          fetchUserDetails();
      }
  } , []);


  const handleOnChangeImage = () => {
    setShowImageChangeModal(true);
  }

  const handleImageUpload = async(file) => {
    if(!file) {
      return ;
    }

    const formData = new FormData();
    formData.append("file" , file);

    try {
      const response = await axios.post(`${BASE_URL}/api/user/change-profile-image` , 
        formData , 
        {
          headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "multipart/form-data"
          }
        }
      );

      await fetchUserDetails();
      setShowImageChangeModal(false);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }


  const handleOnDeleteImage = async() => {
    try {
      const response = await axios.put(`${BASE_URL}/api/user/delete-profile-image` , 
        {
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`,
            "Content-Type" : "multipart/form-data"
          }
        }
      );

      await fetchUserDetails();
      setShowImageChangeModal(false);
    } catch (error) {
      console.error("Error deleting profile image:", error);
      // res.status(500).json({ msg: "Server error" });
    }
  }




  const handleOnEditClick = (field) => {
      setIsEditing((prev) => ({...prev , [field] : true}));
      setFormData((prev) => ({...prev , [field] : userData[field] || ""}));
  }


  const handleInputChange = (field , value) => {
      setFormData((prev) => ({...prev , [field] : value}));
  }


  const handleOnSave = async(field) => {
      try {

        if(userData) {
            const response = await axios.put(`${BASE_URL}/api/user` , {
              [field] : formData[field]
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if(response.data.userData) {
                localStorage.setItem("user" , JSON.stringify(response.data.userData));
            }

            // fetch latest data from backend to stay in sync
            await fetchUserDetails();
            setIsEditing((prev) => ({...prev , [field] : false}));  
            
            toast.success(`Successfully updated the '${field}' field`);
        }

      } catch (error) {
        console.error("Error updating name:", error);
        toast.warning("Failed to update name. Please try again.");
      }
  }


  return (
    <>
      
      <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4'>
            Profile
        </h1>

      <div className="flex justify-center items-center py-16 px-4">
          <div className='w-full max-w-md bg-white rounded-xl py-8 md:py-14 text-center shadow-xl bg-gradient-to-br from-green-100 via-teal-100 to-blue-100'>

            {/* Avatar */}
              <div className='relative w-36 h-36 mx-auto'>
                  <img src={userData?.imageURL ? userData.imageURL : ProfileImage} alt="Profile" className="w-36 h-36 rounded-full mx-auto border-4 border-green-300 object-cover" />
                  <div>
                    <button className='absolute bottom-3 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100' onClick={handleOnChangeImage}>
                          <SquarePen  className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                    </button>
                  </div>
              </div>

            {/* User Info */}
              {userData ? (
                <>
                    <div className="flex justify-center items-center gap-2 mb-2">
                      {/* Name Editing */}
                          {isEditing.name ? (
                            <>
                                <input
                                  type="text"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange("name" , e.target.value)}
                                  className="border px-2 py-1 rounded-md text-gray-800"
                                />
                                <button onClick={() => handleOnSave("name")}>
                                  <Save className="w-5 h-5 text-green-600 hover:text-green-800" />
                                </button>
                            </>
                          ) : (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                  {userData.name || "Name not available"}
                                </h2>
                                <button onClick={() => handleOnEditClick("name")}>
                                  <Pencil className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                                </button>
                            </>
                          )}
                    </div>

                    <p className="text-gray-600 font-semibold mb-1">{userData.email || "Email not found"}</p>

                    <div className="flex justify-center items-center gap-2 mb-1">
                      {/* Name Editing */}
                          {isEditing.mobile ? (
                            <>
                                <input
                                  type="text"
                                  value={formData.mobile}
                                  onChange={(e) => handleInputChange("mobile" , e.target.value)}
                                  className="border px-2 py-1 rounded-md text-gray-800"
                                />
                                <button onClick={() => handleOnSave("mobile")}>
                                  <Save className="w-5 h-5 text-green-600 hover:text-green-800" />
                                </button>
                            </>
                          ) : (
                            <>
                                <p className=" font-semibold text-gray-600">
                                  {userData.mobile || "Mobile not available"}
                                </p>
                                <button onClick={() => handleOnEditClick("mobile")}>
                                  <Pencil className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                                </button>
                            </>
                          )}
                    </div>
                    
                    

                </>
              ) : (
                    <p className="text-gray-500">Loading user data...</p>
              )}

          </div>
      </div>
      
      {showImageCHangeModal && 
      <Modals
      type="image-change"
      onClose={() => setShowImageChangeModal(false)}
      onUpload={handleImageUpload}
      onDelete={handleOnDeleteImage}
      />}
    </>

  )
}

export default Profile
