import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUrlByShortcode, saveUrl } from "../utils/storage";
import { logEvent } from "../middleware/logger";
import './styles.css';

const Redirector = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const entry = getUrlByShortcode(shortcode);

    if (!entry) {
      logEvent("Shortcode not found", { shortcode });
      navigate("/");
      return;
    }

    const now = new Date();
    const expiry = new Date(entry.expiration);

    if (now > expiry) {
      logEvent("Shortcode expired", { shortcode });
      navigate("/");
      return;
    }

    entry.visits += 1;
    saveUrl(shortcode, entry);
    logEvent("Redirection", { shortcode });

    window.location.href = entry.longUrl;
  }, [shortcode, navigate]);

  return (
    <div className="container">
      <p>Redirecting...</p>
    </div>
  );
};

export default Redirector;
