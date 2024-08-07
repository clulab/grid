/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { api } from "api";
import './SplashScreen.css';

export default function SplashScreen({ apiurl }) {

  const [backendReady, setBackendReady] = useState(false)

  function checkBackendReady() {
    api.getReady()
      .then(([message]) => {
        if (message === 'Backend is ready!')
          setBackendReady(true);
        else
          setTimeout(checkBackendReady, 5000);
      })
      .catch((error) => {
        setTimeout(checkBackendReady, 5000);
      });
  }

  useEffect(() => {
    checkBackendReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="flex-container">
        <div className="text-container">
          <h1 className="title">Welcome to THE GRID</h1>
          <div className="loading-container">
            {backendReady ?
              <Link to="/grid/">
                <button className="access-button button-appear">
                  Access
                </button>
              </Link>
              :
              <div className="loading-container">
                <div className="loading"></div>
                <h3>Starting the server...</h3>
              </div>
            }
          </div>
        </div>

        <div className="image-container">
          <img src="grid_logo.png" alt="Grid Image" />
        </div>
      </div>
    </div>
  );
}