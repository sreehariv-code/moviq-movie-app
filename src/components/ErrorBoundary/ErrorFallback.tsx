import React, { ErrorInfo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, resetError }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    resetError();
    window.location.reload();
  };

  const handleGoBack = () => {
    resetError();
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="p-6 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-20 h-20 text-destructive" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            We're sorry, but something unexpected happened. Don't worry, it's not
            your fault!
          </p>

          {/* Error Details (Development Only) */}
          {import.meta.env.DEV && error && (
            <details className="mb-8 text-left">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
                View Error Details (Development Mode)
              </summary>
              <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-64">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-destructive mb-2">
                    Error Message:
                  </p>
                  <code className="text-xs break-all">{error.toString()}</code>
                </div>
                {errorInfo && errorInfo.componentStack && (
                  <div>
                    <p className="text-xs font-semibold text-destructive mb-2">
                      Component Stack:
                    </p>
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleRetry}
              size="lg"
              className="gap-2 min-w-[160px]"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[160px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Link to="/">
              <Button
                variant="ghost"
                size="lg"
                className="gap-2 min-w-[160px]"
                onClick={resetError}
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-8">
            If this problem persists, please try clearing your browser cache or
            contact support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorFallback;
