import React from 'react';

const CenteredLoader = () => (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <div className="loader"></div>
        <style>
        {`
            .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #333;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            }
            @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
            }
        `}
        </style>
    </div>
);

export default CenteredLoader;
