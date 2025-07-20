import '../../styles/Header.css'
import { FiShoppingCart as CartButton } from "react-icons/fi";
import { CgProfile as ProfileButton} from "react-icons/cg";
import { FaSearch as SearchIcon } from "react-icons/fa";
import Logo from "../../assets/images/AppLogo3D.png";
import Title from "../../assets/images/AppTitle3D.png";
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../store/searchStore';
import React, { useState } from 'react';

export default function Header() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const setGlobalSearch = useSearchStore(s => s.setSearch);

    const handleSearch = (e) => {
        e.preventDefault();
        setGlobalSearch(search);
        navigate('/');
    };

    return (
        <>
            <header style={{
                width: '100%',
                background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
                padding: '0 0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 80,
                    padding: '0 32px',
                }}>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <button onClick={() => navigate('/')} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                            <img src={Logo} alt="Logo" height={54} style={{verticalAlign:'middle'}} />
                        </button>
                        <button onClick={() => navigate('/')} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
                            <img src={Title} alt="Title" height={40} style={{verticalAlign:'middle'}} />
                        </button>
                    </div>
                    <form onSubmit={handleSearch} style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.10)',
                        borderRadius: 24,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        padding: '0 12px',
                        minWidth: 260,
                        maxWidth: 400,
                        flex: 1,
                        margin: '0 32px',
                    }}>
                        <input 
                            name='SearchInput' 
                            id='searchinput' 
                            placeholder='Search products...' 
                            style={{
                                flex: 1,
                                minWidth: 0,
                                background: 'transparent',
                                border: 'none',
                                fontSize: 18,
                                color: '#fff',
                                padding: '12px 0',
                                outline: 'none',
                            }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit" style={{background:'none',border:'none',padding:0,display:'flex',alignItems:'center',justifyContent:'center',height:'100%',cursor:'pointer'}}>
                            <SearchIcon size={24} style={{color: "#fff"}}/>
                        </button>
                    </form>
                    <div style={{display:'flex',alignItems:'center',gap:18}}>
                        <button onClick={() => navigate('/cart')} style={{background:'none',border:'none',padding:0,cursor:'pointer',color:'#fff'}}>
                            <CartButton size={28}/>
                        </button>
                        <button onClick={() => navigate('/profile')} style={{background:'none',border:'none',padding:0,cursor:'pointer',color:'#fff'}}>
                            <ProfileButton size={28}/>   
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}