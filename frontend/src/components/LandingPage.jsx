import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import idli from '../assets/idli.jpg';
import dosa from '../assets/dosa.jpg';
import menu1 from '../assets/Menu1.jpg';
import menu2 from '../assets/Menu2.jpg';
import menu3 from '../assets/Menu3.jpg';
import qr from '../assets/QR1.jpg';

const LandingPage = () => {
    const navigateToSignup = () => {
        window.location.href = "/signup";
    };

    return (
        <>
            <div className="landing-container">
                <div className="overlay"></div>
                <div className="logo">SmartDine</div>
                <nav className="landing-navbar">
                    <ul>
                        <li><Link to="/hotel">Hotels</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Sign Up</Link></li>
                    </ul>
                </nav>
                <header className="landing-header">
                    <h1>Welcome to <span>SmartDine</span></h1>
                    <p>Your smart dining experience starts here.</p>
                    <button className="landing-button" onClick={navigateToSignup}>Get Started</button>
                </header>
            </div>
            <div className='body'>
                <div className="container">
                    <div className="image-section"><img src={idli} alt="idli" /><img src={dosa} alt="dosa" /></div>
                    <div className="text-section">
                        <h2>SIGNUP WITH OUR SITE</h2>
                        <p>When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        <button onClick={navigateToSignup}>Signup</button>
                    </div>
                </div>
            </div>
            <div className="menu-container">
                <div className="menu-text">
                    <h2>ADD YOUR MENU</h2>
                    <p>It has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                </div>
                <div className="menu-items">
                    <div className="menu-item"><img src={menu1} alt="Appetizers" /></div>
                    <div className="menu-item"><img src={menu2} alt="Mains" /></div>
                    <div className="menu-item"><img src={menu3} alt="Desserts" /></div>
                </div>
            </div>
            <div className="qr-container">
                <div className="qr-image"><img src={qr} alt="QR Code with Food" /></div>
                <div className="qr-text">
                    <h2>GET YOUR QR</h2>
                    <p>It has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                </div>
            </div>
            <div className="feedback-wrapper">
                <h2 className="section-title">CUSTOMER FEEDBACK</h2>
                <div className="feedback-container">
                    <div className="feedback-card"><div className="quote">❝</div><h3 className="feedback-title">TRANSPORTED TO PARIS</h3><p className="feedback-text">One bite and I felt like I was back in France. Chef Ingrid and her team have outdone themselves!</p><p className="feedback-author">- Rohan, Entrepreneur</p></div>
                    <div className="feedback-card"><div className="quote">❝</div><h3 className="feedback-title">LOVELY BISTRO</h3><p className="feedback-text">The ambience was great - and the food even better! Simple recipes done well, with top-notch ingredients. Will be back!</p><p className="feedback-author">- Anjali, Homemaker</p></div>
                    <div className="feedback-card"><div className="quote">❝</div><h3 className="feedback-title">TRANSPORTED TO PARIS</h3><p className="feedback-text">Eating here made me miss Paris so much. What a treat! I will be bringing my client meetings here.</p><p className="feedback-author">- Meera, Consultant</p></div>
                </div>
            </div>
            <div className="contact-wrapper">
                <div className="image-section"></div>
                <div className="info-section">
                    <h1>SEE YOU SOON</h1>
                    <div className="info-block"><h4>PHONE NUMBER</h4><p>(123) 456-7890</p></div>
                    <div className="info-block"><h4>EMAIL ADDRESS</h4><p>hello@reallygreatsite.com</p></div>
                    <div className="info-block"><h4>RESTAURANT</h4><p>Kle Tech Hubli, Vidyanagar Hubli.</p></div>
                </div>
            </div>
            <span className="footer-text">© 2025 SmartDine | Privacy Policy | Disclaimer</span>
        </>
    );
};

export default LandingPage;
