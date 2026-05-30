
import React, { useState } from "react";
import AppLayout from "../Home/Laayout/hmLaayout";
import "./Repay.css";

export default function Repay() {
    const [iframeUrl] = useState('https://saydalia.ma/fr/medicaments/'); 
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');


    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="repay-page">
            <div className="iframe-container">
                {isLoading && (
                    <div className="iframe-loading">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                )}
                
                {hasError && (
                    <div className="iframe-error">
                        <p> kayn mochkil f loading</p>
                        <p className="error-detail">The website may not allow embedding</p>
                        <a href={iframeUrl} target="_blank" rel="noopener noreferrer" className="open-link">
                            Open in New Tab
                        </a>
                    </div>
                )}

                <iframe
                    src={iframeUrl}
                    title="Saydalia Portal"
                    className="payment-iframe"
                    frameBorder="0"
                    allowFullScreen
                    allow="payment; geolocation"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{ display: hasError ? 'none' : 'block' }}
                />
            </div>
        </div>
            </AppLayout>

    );
}