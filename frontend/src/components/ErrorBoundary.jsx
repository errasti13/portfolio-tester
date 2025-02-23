import { useState, useEffect } from "react";

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const errorHandler = (error) => {
            console.error('Error caught by ErrorBoundary:', error);
            setErrorMessage(error.message || 'An unexpected error occurred');
            setHasError(true);
        };

        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', errorHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
            window.removeEventListener('unhandledrejection', errorHandler);
        };
    }, []);

    if (hasError) {
        return (
            <div>
                <div>Something went wrong. Please try again later.</div>
                <div>Error details: {errorMessage}</div>
            </div>
        );
    }

    return children;
}

export default ErrorBoundary;
