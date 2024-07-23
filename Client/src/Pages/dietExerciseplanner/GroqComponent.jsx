/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaEdit, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
    const [isPlanTypeVisible, setIsPlanTypeVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editablePlan, setEditablePlan] = useState("");

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

    const handlePlanTypeVisibility = () => {
        setIsPlanTypeVisible(prev => !prev);
    };

    const handlePlanTypeSelection = async (type) => {
        setPlanType(type);
        setIsPlanTypeVisible(false); // Auto-hide plan type selection
        setLoading(true);
        try {
            const response = await generatePlan(type, userInfo);
            setPlan(response);
            setEditablePlan(response);
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
        downloadPDF(planType, userInfo, editablePlan);
    };

    const renderTable = ({ node, ...props }) => {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                    {props.children}
                </table>
            </div>
        );
    };

    const renderTableCell = ({ node, isHeader, ...props }) => {
        const Tag = isHeader ? 'th' : 'td';
        return (
            <Tag className={`px-4 py-2 ${isHeader ? 'bg-gray-700 font-semibold' : 'bg-gray-800'} text-left`}>
                {props.children}
            </Tag>
        );
    };

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
    };

    const handleEditChange = (event) => {
        setEditablePlan(event.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
            {step === 1 && (
                <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl border border-gray-700">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">User Information</h2>
                    <Notice />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={userInfo.age}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    />
                    <input
                        type="text"
                        name="height"
                        placeholder="Height (in cm)"
                        value={userInfo.height}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    />
                    <input
                        type="text"
                        name="weight"
                        placeholder="Weight (in kg)"
                        value={userInfo.weight}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    />
                    <select
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select
                        name="dietType"
                        value={userInfo.dietType}
                        onChange={handleInputChange}
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
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
                        className="input-field bg-gray-700 text-white border-gray-600 focus:border-blue-400"
                    />
                    <button onClick={saveUserInfo} className="button-primary bg-blue-500 hover:bg-blue-600">Save and Continue</button>
                </div>
            )}
            <div>
                <button onClick={handlePlanTypeVisibility} className=" button-secondary bg-gray-600 hover:bg-gray-700 flex items-center justify-center">
                    {isPlanTypeVisible ? <FaChevronLeft className="mr-2" /> : <FaChevronRight className="mr-2" />}
                    {isPlanTypeVisible ? "Hide Plan Type" : "Show Plan Type"}
                </button>

                {step === 2 && isPlanTypeVisible && (
                    <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl border border-gray-700">
                        <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Choose Plan Type</h2>
                        <Notice />
                        <div className="flex justify-around gap-2 mb-6">
                            <button onClick={() => handlePlanTypeSelection('diet')} className="button-primary bg-green-500 hover:bg-green-600">Diet Plan</button>
                            <button onClick={() => handlePlanTypeSelection('exercise')} className="button-primary bg-orange-500 hover:bg-orange-600">Exercise Plan</button>
                        </div>
                        <button onClick={editUserInfo} className="button-secondary bg-gray-600 hover:bg-gray-700 flex items-center justify-center w-full">
                            <FaEdit className="mr-2" /> Edit User Information
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-6xl bg-gray-800 p-8 rounded-2xl shadow-lg my-6 transition-all duration-300 hover:shadow-xl border border-gray-700">
                {loading ? (
                    <>
                        <div>Loading....</div>
                    </>
                ) : (
                    plan && (
                        <>
                            <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">
                                {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
                            </h2>
                            <div className="plan-content prose prose-invert max-w-none">
                                {isEditing ? (
                                    <textarea
                                        className="w-full h-96 bg-gray-700 text-white p-4 rounded-lg"
                                        value={editablePlan}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <ReactMarkdown
                                        children={editablePlan}
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            table: renderTable,
                                            th: props => renderTableCell({ ...props, isHeader: true }),
                                            td: props => renderTableCell({ ...props, isHeader: false }),
                                        }}
                                    />
                                )}
                            </div>
                            <div className="flex justify-around gap-2 mt-6">
                                <button onClick={handleEditToggle} className="button-secondary bg-gray-600 hover:bg-gray-700 flex items-center justify-center">
                                    <FaEdit className="mr-2" />
                                    {isEditing ? "Save" : "Edit"}
                                </button>
                                <button onClick={handleDownloadPDF} className="button-primary bg-blue-500 hover:bg-blue-600">
                                    Download PDF
                                </button>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default GroqComponent;
