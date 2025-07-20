import Header from '../common/Header';
import SignUp from "../../assets/images/SignUp.png";
import '../../styles/SignUpForm.css'
import Title from '../../assets/images/AppTitle3D.png'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SignUpForm(){
    const navigate = useNavigate();
    const { handleSignup, error, loading } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await handleSignup({ name, email, password });
        setSubmitting(false);
        setSuccess(true);
    };

    React.useEffect(() => {
        if (success && !error) {
            navigate('/signin');
        }
    }, [success, error, navigate]);

    return(
            <>
                    <div className='Body'>
                            <img src={SignUp} alt="Cart and Laptop" style={{height:"700px",width:"500px",marginLeft:"30px"}}/>
                            <div style={{height:"700px",width:"250px"}}/>
                            <div style={{height:"700px",width:"400px",display:'flex',alignItems:'center'}}>
                                <form className="SignUpDetails" onSubmit={onSubmit}>
                                    <div style={{display:'flex',flexDirection:'row', alignItems:'center', justifyContent:'Center'}}>
                                        <p style={{fontSize:"20px", fontFamily:"sans-serif", marginRight:"8px", transform:'translateY(-2px)'}}>Create Account to use  </p>
                                        <img src={Title} alt="Title" height="125px" width="125px" />
                                    </div>
                                    <p style={{fontSize:"20px",marginBotton:"50px", transform:'translateY(-30px)'}}>Enter your details below</p>
                                    <input name="name" placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />
                                    <input type="email" name="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                                    <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button id="SubmitButton" type="submit" disabled={submitting || loading}> Sign Up </button>
                                    {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
                                    <span style={{marginTop:'20px'}}>
                                        <p style={{display:'inline'}}>Become a seller by</p>
                                        <p style={{display:'inline',fontWeight:'bold',marginLeft:'8px', color:'#E07575', cursor:'pointer'}} onClick={() => navigate('/signin')}>Registering here</p>
                                    </span>
                                </form>
                            </div>
                    </div>
                </>
    )
}