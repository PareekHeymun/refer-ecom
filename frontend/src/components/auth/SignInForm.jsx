import Signin from "../../assets/images/SignIn.png";
import '../../styles/SignInForm.css'
import Title from '../../assets/images/AppTitle3D.png'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function SignIn(){
    const navigate = useNavigate();
    const { handleSignin, error, user, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    React.useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await handleSignin({ email, password });
        setSubmitting(false);
    };

    return(
        <>
            <div className='Body'>
                    <img src={Signin} alt="Cart and Mobile" style={{height:"700px",width:"750px"}}/>
                    <div style={{height:"700px",width:"250px"}}/>
                    <div style={{height:"700px",width:"400px",display:'flex',alignItems:'center'}}>
                        <form className="SignInDetails" onSubmit={onSubmit}>
                            <div style={{display:'flex',flexDirection:'row', alignItems:'center', justifyContent:'Center'}}>
                                <p style={{fontSize:"30px", fontFamily:"sans-serif", marginRight:"10px", transform:'translateY(-3px)'}}>Login to </p>
                                <img src={Title} alt="Title" height="150px" width="150px" />
                            </div>
                            <p style={{fontSize:"20px",marginBotton:"50px", transform:'translateY(-30px)'}}>Enter your details below</p>
                            <input type="email" name="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                            <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
                            <button id="SubmitButton" type="submit" disabled={submitting || loading}> Log In </button>
                            {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
                            <span style={{marginTop:'20px'}}>
                                <p style={{display:'inline'}}>Don't have an account ?</p>
                                <p style={{display:'inline',fontWeight:'bold',marginLeft:'10px', color:'#E07575', cursor:'pointer'}} onClick={() => navigate('/signup')}>Sign Up</p>
                            </span>
                        </form>
                    </div>
            </div>
        </>
    )
}