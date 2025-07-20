import Header from '../common/Header';
import SignUp from "../../assets/images/SignUp.png";
import '../../styles/SignUpForm.css'
import Title from '../../assets/images/AppTitle3D.png'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaEnvelope, FaLock, FaStore } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

export default function SignUpForm(){
    const navigate = useNavigate();
    const { handleSignup, error, loading } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("buyer");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showNotification } = useNotification();

    const onSubmit = async (e) => {
        e.preventDefault();
        // Email domain validation
        const emailLower = email.toLowerCase();
        if (!(/@gmail\.com$/.test(emailLower) || /@iiitm\.ac\.in$/.test(emailLower))) {
            showNotification('Email must end with @gmail.com or @iiitm.ac.in', 'error');
            setSubmitting(false);
            return;
        }
        // Password length validation
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            setSubmitting(false);
            return;
        }
        setSubmitting(true);
        await handleSignup({ name, email, password, role });
        setSubmitting(false);
        setSuccess(true);
    };

    useEffect(() => {
        if (success && !error) {
            showNotification('Signup successful! Please log in.', 'success');
            // Do NOT auto-redirect to /signin
        }
    }, [success, error, showNotification]);

    useEffect(() => {
        if (error) {
            showNotification(error, 'error');
        }
    }, [error, showNotification]);

    return(
        <div className="signup-outer-container">
            {/* Website title image removed as requested */}
            <div className='Body'>
                <div className="signup-img-col">
                    <img src={SignUp} alt="Cart and Laptop" className="signup-side-img"/>
                </div>
                <div className="signup-form-col">
                    <form className="SignUpDetails" onSubmit={onSubmit} autoComplete="off">
                        <h2 className="signup-heading">Sign Up</h2>
                        <p className="signup-subheading">Create your account to use Scroll2Ship</p>
                        <div className="signup-input-row">
                            <FaUser className="signup-input-icon" />
                            <input name="name" placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="signup-input-row">
                            <FaEnvelope className="signup-input-icon" />
                            <input type="email" name="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="signup-input-row">
                            <FaLock className="signup-input-icon" />
                            <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div className="signup-input-row" style={{marginBottom: 18, alignItems: 'center'}}>
                            <FaStore className="signup-input-icon" />
                            <label style={{marginRight: 10, fontWeight: 600}}>Sign up as:</label>
                            <select name="role" value={role} onChange={e => setRole(e.target.value)} style={{padding: '0.5rem', borderRadius: 6, border: '1.5px solid #bbb', fontSize: 16}}>
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>
                        <button id="SubmitButton" type="submit" disabled={submitting || loading}>
                            {submitting ? 'Signing up...' : 'Sign Up'}
                        </button>
                        {/* Error notification now handled globally */}
                        <span className="signup-login-link">
                            <p style={{display:'inline'}}>Already have an account?</p>
                            <p style={{display:'inline',fontWeight:'bold',marginLeft:'8px', color:'#E07575', cursor:'pointer'}} onClick={() => navigate('/signin')}>Login here</p>
                        </span>
                    </form>
                </div>
            </div>
            <div className="signup-bottom-info">
                <h3>Login/Signup</h3>
                <p>Welcome to Scroll2Ship! Please sign up or log in to access all features and enjoy a seamless shopping experience.</p>
            </div>
        </div>
    )
}