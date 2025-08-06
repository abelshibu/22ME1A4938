import React, { useState } from "react";
import { saveUrl, generateShortcode, getAllUrls } from "../utils/storage";
import { logEvent } from "../middleware/logger";
import './styles.css';

const URLShortener = () => {
    const [inputs, setInputs] = useState([
        { longUrl: "", validity: "", preferredCode: "" },
    ]);
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState([]);
    const [urls, setUrls] = useState(getAllUrls());

    const isValidURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleInputChange = (index, field, value) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };

    const addInput = () => {
        if (inputs.length < 5) {
            setInputs([...inputs, { longUrl: "", validity: "", preferredCode: "" }]);
        }
    };

    const handleShortenAll = () => {
        const newErrors = [];
        const newResults = [];

        inputs.forEach(({ longUrl, validity, preferredCode }, index) => {
            if (!longUrl || !isValidURL(longUrl)) {
                newErrors[index] = "Invalid URL";
                return;
            }

            const validityMinutes = validity ? parseInt(validity, 10) : 7 * 24 * 60; // default 7 days
            if (isNaN(validityMinutes) || validityMinutes <= 0) {
                newErrors[index] = "Invalid validity period (minutes)";
                return;
            }

            const shortcode = preferredCode || generateShortcode();
            const createdAt = new Date();
            const expiration = new Date(createdAt.getTime() + validityMinutes * 60000);

            const entry = {
                longUrl,
                expiration: expiration.toISOString(),
                createdAt: createdAt.toISOString(),
                visits: 0,
            };

            saveUrl(shortcode, entry);
            logEvent("URL Shortened", { shortcode });

            newResults.push({
                code: shortcode,
                original: longUrl,
                createdAt: createdAt.toISOString(),
                expiresAt: expiration.toISOString(),
            });

            newErrors[index] = null;
        });

        setErrors(newErrors);
        setResults(newResults);
        setUrls(getAllUrls());
    };

    return (
        <div className="container">
            <h1>URL Shortener</h1>
            {inputs.map((input, index) => (
                <div key={index} className="input-group">
                    <input
                        type="text"
                        placeholder="Long URL"
                        value={input.longUrl}
                        onChange={(e) => handleInputChange(index, "longUrl", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Validity (mins)"
                        value={input.validity}
                        onChange={(e) => handleInputChange(index, "validity", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Preferred Shortcode (optional)"
                        value={input.preferredCode}
                        onChange={(e) => handleInputChange(index, "preferredCode", e.target.value)}
                    />
                    {errors[index] && <p className="error">{errors[index]}</p>}
                </div>
            ))}

            <button onClick={addInput} disabled={inputs.length >= 5}>
                + Add Another URL
            </button>

            <button onClick={handleShortenAll}>Shorten URLs</button>

            {results.length > 0 && (
                <div className="results">
                    <h2>Shortened URLs</h2>
                    {results.map((res, i) => (
                        <div key={i} className="result-item">
                            <p>
                                <strong>Original:</strong> {res.original}
                            </p>
                            <p>
                                <strong>Shortened:</strong>{" "}
                                <a href={`/${res.code}`} target="_blank" rel="noopener noreferrer">
                                    {window.location.origin}/{res.code}
                                </a>
                            </p>
                            <p>
                                <strong>Created At:</strong> {new Date(res.createdAt).toLocaleString()}
                            </p>
                            <p>
                                <strong>Expires At:</strong> {new Date(res.expiresAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="url-list">
                <h2>All Stored URLs</h2>
                {Object.entries(urls).map(([code, entry]) => (
                    <div className="url-item" key={code}>
                        <div><strong>Original:</strong> <a href={entry.longUrl} target="_blank" rel="noopener noreferrer">{entry.longUrl}</a></div>
                        <div><strong>Shortened:</strong> <a href={`/${code}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/{code}</a></div>
                        <div><strong>Created:</strong> {new Date(entry.createdAt).toLocaleString()}</div>
                        <div><strong>Expires:</strong> {new Date(entry.expiration).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default URLShortener;
