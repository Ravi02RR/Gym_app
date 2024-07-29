import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="overlay">
                <div className="content">
                    <h1>Welcome to FitLife Gym</h1>
                    <p>Your journey to a healthier life starts here.</p>
                    <button className="explore-button">Explore Now</button>
                </div>
            </div>
        </div>
    );
};

export default Home;