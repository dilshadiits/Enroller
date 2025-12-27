import Link from 'next/link';
import LoginForm from './login/LoginForm';
import './home.css';

export default function HomePage() {
    return (
        <div className="home-container">
            {/* Left Side - Image/Branding */}
            <div className="home-branding">
                {/* Decorative circles */}
                <div className="home-circle home-circle-1" />
                <div className="home-circle home-circle-2" />

                <div className="home-branding-content">
                    <div className="home-icon">
                        🎓
                    </div>
                    <h1 className="home-title">
                        Enroller
                    </h1>
                    <p className="home-tagline">
                        Supercharge your course admissions with smart lead tracking and automated commissions
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="home-login-section">
                <div className="home-login-container">
                    <div className="home-login-header">
                        <h2 className="home-login-title">
                            Welcome Back
                        </h2>
                        <p className="home-login-subtitle">Sign in to your dashboard</p>
                    </div>

                    <LoginForm />

                    <p className="home-footer">
                        © 2024 Enroller. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

