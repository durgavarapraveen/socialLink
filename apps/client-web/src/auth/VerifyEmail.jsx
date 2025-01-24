import { useEffect, useState } from "react";

const EmailVerified = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1)); // Parse the hash params
    const accessToken = urlParams.get("access_token");
    const expiresAt = urlParams.get("expires_at");

    if (accessToken && expiresAt) {
      // Do something with the access_token (e.g., store it, call an API, etc.)
      localStorage.setItem("access_token", accessToken);

      // You can navigate to a protected page or show a confirmation message
      setLoading(false);
    } else {
      // Handle error case
      setLoading(false);
    }
  }, [history]);

  return (
    <div>
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>Your email is successfully verified. Redirecting...</p>
      )}
    </div>
  );
};

export default EmailVerified;
