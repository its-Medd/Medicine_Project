import { toast } from "react-toastify";

function SignInwithGoogle() {
  function googleLogin() {
    toast.info("Google sign-in is not available in the Express version yet.", {
      position: "top-center",
    });
  }
  return (
    <div>
 

<button type="button" className="social-login-btn" onClick={googleLogin}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M21.35 11.1H12.18V13.9H18.7C18.38 15.4 17.52 16.64 16.25 17.42V19.6H19.05C20.95 17.84 22 15.27 22 12.2C22 11.55 21.93 11.18 21.35 11.1Z"
      fill="#4285F4"
    />
    <path
      d="M12.18 22C14.97 22 17.32 21.07 19.05 19.6L16.25 17.42C15.35 18.02 14.09 18.4 12.18 18.4C9.48 18.4 7.16 16.62 6.33 14.2H3.45V16.45C5.16 19.77 8.42 22 12.18 22Z"
      fill="#34A853"
    />
    <path
      d="M6.33 14.2C6.11 13.6 6 12.93 6 12.25C6 11.57 6.11 10.9 6.33 10.3V8.05H3.45C2.82 9.28 2.45 10.71 2.45 12.25C2.45 13.79 2.82 15.22 3.45 16.45L6.33 14.2Z"
      fill="#FBBC05"
    />
    <path
      d="M12.18 6.1C14.23 6.1 15.86 6.82 17.05 7.85L19.15 5.75C17.29 4.08 14.97 3 12.18 3C8.42 3 5.16 5.23 3.45 8.55L6.33 10.8C7.16 8.38 9.48 6.1 12.18 6.1Z"
      fill="#EA4335"
    />
  </svg>
  Connect with Google Account
</button>
   </div>
  );
}
export default SignInwithGoogle;
