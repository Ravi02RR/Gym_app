import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Home from "../Pages/Home/Home";
import Layout from "../Layout";
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Home />} />
                <Route path="about" element={<div className="flex justify-center items-center bg-slate-700 min-h-screen">About</div>} />
            </Route>

        </Route>
    )
)
// const router = createBrowserRouter([

//     {
//         path: '/',
//         element: <Layout />,
//         children: [
//             {
//                 path: "",
//                 element: <Home />

//             },
//             {
//                 path: "about",
//                 element: <div className="flex justify-center items-center bg-slate-700 min-h-screen">About</div>
//             }
//         ]

//     }
// ])



export default router;