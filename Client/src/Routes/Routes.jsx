/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// Lazy load the components
const Home = lazy(() => import("../Pages/pageRoute.js").then(module => ({ default: module.Home })));
const GroqComponent = lazy(() => import("../Pages/pageRoute.js").then(module => ({ default: module.GroqComponent })));
const Layout = lazy(() => import("../Layout"));

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in error boundary: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        // eslint-disable-next-line react/prop-types
        return this.props.children;
    }
}

// Fallback component for Suspense
const Loading = () => <div>Loading...</div>;

// Not Found page component
const NotFound = () => (
    <div className="flex justify-center items-center bg-slate-700 min-h-screen">
        <h1 className="text-white">404 - Page Not Found</h1>
    </div>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Layout />}>
                <Route
                    path=""
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
                            About
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
                    path="*"
                    element={<NotFound />}
                />
            </Route>
        </Route>
    )
);

export default router;
