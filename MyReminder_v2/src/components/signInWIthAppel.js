import { toast } from "react-toastify";

function SignInWithApple() {
    function appleLogin() {
        toast.info("Apple sign-in is not available in the Express version yet.", {
            position: "top-center"
        });
    }

    return (
        <button type="button" className="social-login-btn" onClick={appleLogin}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    d="M16.365 1.43c0 1.14-.42 2.26-1.19 3.13-.78.87-2.06 1.55-3.17 1.45-.12-1.08.47-2.24 1.21-2.97.81-.88 2.18-1.52 3.15-1.61zM20.37 17.35c-.55 1.31-.82 1.89-1.54 3.05-1 1.63-2.41 3.66-4.17 3.68-1.55.02-1.95-.99-4.06-.99-2.12 0-2.56 1-4.13.96-1.76-.03-3.11-1.85-4.11-3.48-2.82-4.7-3.12-10.2-1.38-13.1 1.25-2.03 3.23-3.22 5.1-3.22 1.95 0 3.18 1.08 4.79 1.08 1.55 0 2.5-1.09 4.83-1.09 1.69 0 3.48.92 4.73 2.5-4.15 2.27-3.48 8.25.71 10.71z"
                    fill="black"
                />
            </svg>
            Connect with Apple Account
        </button>
    );
}

export default SignInWithApple;
