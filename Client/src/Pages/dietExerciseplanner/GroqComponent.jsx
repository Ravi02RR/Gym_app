/* eslint-disable no-unused-vars */
/* eslint-disable react/no-children-prop */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaEdit } from 'react-icons/fa';
import './Groq.css';
import rehypeRaw from 'rehype-raw';
import Notice from "../../Components/dietplanner/Notice";
import Loader from "../../Components/dietplanner/Loader";
import { generatePlan } from "../../Services/DietandExercise/GroqService";
import { downloadPDF } from "../../Services/DietandExercise/pdfService";

const GroqComponent = () => {
    const [step, setStep] = useState(1);
    const [userInfo, setUserInfo] = useState(() => {
        const savedInfo = localStorage.getItem("userInfo");
        return savedInfo ? JSON.parse(savedInfo) : {
            name: "",
            age: "",
            height: "",
            weight: "",
            gender: "",
            dietType: "",
            goal: ""
        };
    });
    const [planType, setPlanType] = useState("");
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
            setStep(2);
        }
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const saveUserInfo = () => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setStep(2);
    };

    const editUserInfo = () => {
        setStep(1);
    };

    const handleToggle = () => {
        setIsCollapsed(prev => !prev);
    };

    const handlePlanTypeSelection = async (type) => {
        setPlanType(type);
        setIsCollapsed(true);
        setLoading(true);
        try {
            const response = await generatePlan(type, userInfo);
            setPlan(response);
        } catch (error) {
            toast("Error! Cannot process request", {
                type: "error",
                position: "top-center",
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const planContent = document.querySelector('.plan-content').innerHTML;
        downloadPDF(planType, userInfo, planContent);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200">
            {step === 1 && (
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">User Information</h2>
                    <Notice />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={userInfo.age}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="height"
                        placeholder="Height (in cm)"
                        value={userInfo.height}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="weight"
                        placeholder="Weight (in kg)"
                        value={userInfo.weight}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <select
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleInputChange}
                        className="input-field"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select
                        name="dietType"
                        value={userInfo.dietType}
                        onChange={handleInputChange}
                        className="input-field"
                    >
                        <option value="">Select Diet Type</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Keto</option>
                        <option value="paleo">Paleo</option>
                        <option value="mediterranean">Mediterranean</option>
                    </select>
                    <input
                        type="text"
                        name="goal"
                        placeholder="Goal"
                        value={userInfo.goal}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                    <button onClick={saveUserInfo} className="button-primary">Save and Continue</button>
                </div>
            )}

            {step === 2 && (
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Choose Plan Type</h2>
                    <Notice />
                    <div className="flex justify-around mb-6">
                        <button onClick={() => handlePlanTypeSelection('diet')} className="button-primary">Diet Plan</button>
                        <button onClick={() => handlePlanTypeSelection('exercise')} className="button-primary">Exercise Plan</button>
                    </div>
                    <button onClick={editUserInfo} className="button-secondary flex items-center"><FaEdit className="mr-2" /> Edit User Information</button>
                </div>
            )}

            {loading && <Loader />}

            {plan && (
                <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">{planType.charAt(0).toUpperCase() + planType.slice(1)} Plan</h2>
                    <ReactMarkdown children={plan} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
                    <div className="flex justify-between mt-6">
                        <button onClick={handleToggle} className="button-secondary">{isCollapsed ? "Show Details" : "Hide Details"}</button>
                        <button onClick={handleDownloadPDF} className="button-primary">Download PDF</button>
                    </div>
                    {!isCollapsed && (
                        <div className="plan-content">
                            <ReactMarkdown children={plan} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroqComponent;
