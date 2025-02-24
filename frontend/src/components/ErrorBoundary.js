import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("⚠️ خطأ غير متوقع:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h2 className="text-2xl font-bold text-red-600">🚨 حدث خطأ غير متوقع!</h2>
                    <p className="text-gray-500">يرجى تحديث الصفحة أو المحاولة لاحقًا.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
