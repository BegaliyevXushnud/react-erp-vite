import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import './error.css'; // Make sure to import your CSS file

const NotFound = () => {
  // Initialize ReactGA
  useEffect(() => {
    ReactGA.initialize('YOUR_GA_TRACKING_ID'); // Replace with your Google Analytics tracking ID
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
          <h2>Page not found</h2>
        </div>
        <a href="#" onClick={() => console.log('Report clicked')}>Report</a>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
