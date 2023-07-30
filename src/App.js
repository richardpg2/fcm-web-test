import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import logo from "./assets/sparky-dash-high-five.gif";
import { getFirebaseToken, onForegroundMessage } from "./firebase";

import { useCopyClipboard } from "./useCopy";
export default function App() {
  const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === "default");

  const [token, setToken] = useState("");

  const [isCopied, copy] = useCopyClipboard(200);
  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log("Received foreground message: ", payload);
        const {
          notification: { title, body },
        } = payload;
        toast(<ToastifyNotification title={title} body={body} />);
      })
      .catch((err) => console.log("An error occured while retrieving foreground message. ", err));
  }, []);

  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log("Firebase token: ", firebaseToken);
        setToken(firebaseToken);
        if (firebaseToken) {
          setShowNotificationBanner(false);
        }
      })
      .catch((err) => console.error("An error occured while retrieving firebase token. ", err));
  };

  const ToastifyNotification = ({ title, body }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );

  return (
    <div className="app">
      {showNotificationBanner && (
        <div className="notification-banner">
          <span>The app needs permission to</span>
          <a href="#" className="notification-banner-link" onClick={handleGetFirebaseToken}>
            enable push notifications.
          </a>
        </div>
      )}

      <button onClick={handleGetFirebaseToken}>Show token</button>

      <p>Token: {token}</p>
      <button onClick={() => copy(token)} class="btn-primary">
        copy token
      </button>

      <img src={logo} className="app-logo" alt="logo" />

      <button
        className="btn-primary"
        onClick={() => toast(<ToastifyNotification title="New Message" body="Hi there!" />)}
      >
        Show toast notification
      </button>

      <ToastContainer hideProgressBar />
    </div>
  );
}
