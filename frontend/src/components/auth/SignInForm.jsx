import Signin from "../../assets/images/SignIn.png";
import '../../styles/SignInForm.css'
import Title from '../../assets/images/AppTitle3D.png'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

export default function SignIn(){
    const navigate = useNavigate();
    const { handleSignin, error, user, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            showNotification(error, 'error');
        }
    }, [error, showNotification]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await handleSignin({ email, password });
        setSubmitting(false);
    };

    return(
        <div className="signin-outer-container">
            {/* Website title image removed as requested */}
            <div className='Body'>
                <div className="signin-img-col">
                    <img src={Signin} alt="Cart and Mobile" className="signin-side-img"/>
                </div>
                <div className="signin-form-col">
                    <form className="SignInDetails" onSubmit={onSubmit} autoComplete="off">
                        <h2 className="signin-heading">Login</h2>
                        <p className="signin-subheading">Login to your Scroll2Ship account</p>
                        <div className="signin-input-row">
                            <FaEnvelope className="signin-input-icon" />
                            <input type="email" name="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="signin-input-row">
                            <FaLock className="signin-input-icon" />
                            <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button id="SubmitButton" type="submit" disabled={submitting || loading}>Log In</button>
                        {/* Error notification now handled globally */}
                        <span className="signin-signup-link">
                            <p style={{display:'inline'}}>Don't have an account?</p>
                            <p style={{display:'inline',fontWeight:'bold',marginLeft:'10px', color:'#E07575', cursor:'pointer'}} onClick={() => navigate('/signup')}>Sign Up</p>
                        </span>
                    </form>
                </div>
            </div>
            <div className="signin-bottom-info">
                <h3>Login/Signup</h3>
                <p>Welcome to Scroll2Ship! Please sign up or log in to access all features and enjoy a seamless shopping experience.</p>
            </div>
        </div>
    )
}