import React , {useState , useEffect , useContext} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/Trail_loading.json';


const BASE_URL = import.meta.env.VITE_BASE_URL;


const CategoryList = ({userId}) => {

    const [incomeCategories , setIncomeCategories] = useState([]);
    const [expenseCategories , setExpenseCategories] = useState([]);
    const [offeringCategory , setOfferingCategory] = useState([]);
    const [showForm , setShowForm] = useState(false);
    const [formData , setFormData] = useState({
        name: "",
        type: "income",
    })
    const [loading , setLoading] = useState(true);


    const handleOnSubmit = async(e) => {
        e.preventDefault();

        const {name , type} = formData;
        if(!name || !type) {
            toast.error("All Fields are required");
            return;
        }

        try { 
            const response = await axios.post(`${BASE_URL}/api/category` , {
                name: formData.name,
                type: formData.type,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });

            console.log(response.data);
            toast.success("Successfully added the category")
            setFormData({name: "" , type: "income"});
            setShowForm(false);
            await fetchCategories();
        } catch (error) {
            console.log("Error in saving new category" , error);
        }
    }


    const handleOnChange = (e) => {
        setFormData((prev) => ({
            ...prev ,
            [e.target.name] : e.target.value
        }))
    }


    const handleOnRemove = async(idToRemove) => {
        try {
            await axios.delete(`${BASE_URL}/api/category/${idToRemove}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

            toast.success("Successfully removed the category")
            fetchCategories();
        } catch (error) {
            console.log("Error in deleting the category" , error);
        }
    }



    
    const fetchCategories = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/api/category`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
            const allCategories = response.data || [];

            setIncomeCategories(allCategories.filter(cat => cat.type === "income"));
            setExpenseCategories(allCategories.filter(cat => cat.type === "expense"));
            setOfferingCategory(allCategories.filter(cat => cat.type === "contribution"));
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(userId) {
            fetchCategories();
        }
        else {
            setLoading(false);
        }
    } , [userId]);





    if(loading) {
        return (
        <>
            {/* Illustration */}
            <div className="flex justify-center items-center h-screen">
                <Lottie 
                    animationData={loadingAnimation} 
                    loop={true} 
                    style={{ width: 120, height: 120 }} 
                />
            </div>
        </>
        )
    }





  return (
    <>

        <div className="flex flex-col justify-center my-5 gap-10">

            <form onSubmit={handleOnSubmit} className="flex flex-col md:flex-row gap-4 items-center bg-white shadow-md p-4 rounded-lg mx-5">
                {!showForm && (
                    <>
                        <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
                        >
                            +Category
                        </button>
                    </>
                )}
                {showForm && (
                    <>
                        <input 
                        type="text"
                        name="name"
                        placeholder='Category Name...'
                        value={formData.name}
                        onChange={handleOnChange}
                        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select 
                        name="type"
                        value={formData.type}
                        onChange={handleOnChange}
                        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="contribution">Contribution</option>
                        </select>

                        <button 
                        type="submit" 
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300" 
                        >
                            Save Category
                        </button>
                    </>
                )}
            </form>

            <div className="space-y-10">
                <div className='sm:mx-5'>
                    {/* Income categories */}
                    <h1 className='font-semibold mb-4 text-xl text-green-700'>Income Categories</h1>
                    <table className='w-full table-fixed border border-collapse bg-white shadow-sm rounded-md'>
                        <thead className="bg-green-200 text-center">
                            <tr>
                                <th className='p-3 border'>Name</th>
                                <th className='p-3 border'>Type</th>
                                <th className='p-3 border'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeCategories.length > 0 ? (incomeCategories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-green-50">
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 break-words max-w-[100px]'>{cat.name}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 capitalize break-words max-w-[100px]'>{cat.type}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border sm:pl-5'>
                                            <button className="bg-gradient-to-r from-red-500 to-rose-600 text-white sm:px-4 sm:py-2 px-1.5 py-1.5 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
                                            onClick={() => handleOnRemove(cat._id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr> 
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='sm:mx-5'>
                    {/* Expense categories */}
                    <h1 className='font-semibold mb-4 text-xl text-red-700'>Expense Categories</h1>
                    <table className='w-full table-fixed border border-collapse bg-white shadow-sm rounded-md'>
                        <thead  className="bg-red-200 text-center">
                            <tr>
                                <th className='p-3 border'>Name</th>
                                <th className='p-3 border'>Type</th>
                                <th className='p-3 border'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseCategories.length > 0 ? (expenseCategories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-red-50">
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 break-words max-w-[100px]'>{cat.name}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 capitalize break-words max-w-[100px]'>{cat.type}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border sm:pl-5'>
                                            <button className="bg-gradient-to-r from-red-500 to-rose-600 text-white sm:px-4 sm:py-2 px-1.5 py-1.5 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
                                            onClick={() => handleOnRemove(cat._id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )) 
                            ) : (
                               <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr> 
                            )}
                        </tbody>
                    </table>
                </div>


                <div className='sm:mx-5'>
                    {/* Contribution categories */}
                    <h1 className='font-semibold mb-4 text-xl text-blue-500'>Contribution Categories</h1>
                    <table className='w-full table-fixed border border-collapse bg-white shadow-sm rounded-md'>
                        <thead className="bg-green-200 text-center">
                            <tr>
                                <th className='p-3 border'>Name</th>
                                <th className='p-3 border'>Type</th>
                                <th className='p-3 border'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offeringCategory.length > 0 ? (offeringCategory.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-green-50">
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 break-words max-w-[100px]'>{cat.name}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border pl-5 capitalize break-words max-w-[100px]'>{cat.type}</td>
                                        <td className='text-sm sm:text-[17px] p-3 border sm:pl-5'>
                                            <button className="bg-gradient-to-r from-red-500 to-rose-600 text-white sm:px-4 sm:py-2 px-1.5 py-1.5 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
                                            onClick={() => handleOnRemove(cat._id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )) 
                            ): (
                                 <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      
    </>
  )
}

export default CategoryList
