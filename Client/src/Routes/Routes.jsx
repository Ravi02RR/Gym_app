import React, { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Lazy load the components
const Home = lazy(() => import("../Pages/pageRoute.js").then(module => ({ default: module.Home })));
const GroqComponent = lazy(() => import("../Pages/pageRoute.js").then(module => ({ default: module.GroqComponent })));
const Layout = lazy(() => import("../Layout"));
const PostureTraker = lazy(() => import("../Pages/pageRoute.js").then(module => ({ default: module.PostureTraker })));

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in error boundary: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white"><h1>Something went wrong. Please try again later.</h1></div>;
        }

        return this.props.children;
    }
}

// Fallback component for Suspense
const Loading = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
        <div className="text-xl">Loading...</div>
    </div>
);

// Not Found page component
const NotFound = () => (
    <div className="flex justify-center items-center bg-slate-700 min-h-screen">
        <h1 className="text-white text-2xl">404 - Page Not Found</h1>
    </div>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={
            <Suspense fallback={<Loading />}>
                <Layout />
            </Suspense>
        }>
            <Route
                index
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <Home />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="about"
                element={
                    <div className="flex justify-center items-center bg-slate-700 min-h-screen">
                        <h1 className="text-white text-2xl">About</h1>
                    </div>
                }
            />
            <Route
                path="planner"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <GroqComponent />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route
                path="posture"
                element={
                    <ErrorBoundary>
                        <Suspense fallback={<Loading />}>
                            <PostureTraker />
                        </Suspense>
                    </ErrorBoundary>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);

export default router;
