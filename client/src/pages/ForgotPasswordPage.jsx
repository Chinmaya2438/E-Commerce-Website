import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";
import toast from "react-hot-toast";
import { HiOutlineMail } from "react-icons/hi";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setEmailSent(true);
      toast.success("Reset link sent directly to your inbox!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to dispatch email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Forgot Password</h1>
          <p className="text-dark-500">
            {emailSent
              ? "Check your inbox for the secure reset link."
              : "Enter your email address to receive a secure password reset link."}
          </p>
        </div>

        <div className="card p-8">
          {emailSent ? (
            <div className="text-center">
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                An email containing your unique password reset URL has been securely dispatched.
              </div>
              <Link to="/login" className="btn-primary w-full inline-block text-center py-3">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base"
              >
                {loading ? "Dispatching..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
        
        {!emailSent && (
          <p className="text-center text-sm text-dark-500 mt-6">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in securely
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
