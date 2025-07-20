import '../../styles/Header.css'
import { FiShoppingCart as CartButton } from "react-icons/fi";
import { CgProfile as ProfileButton} from "react-icons/cg";
import { FaSearch as SearchIcon } from "react-icons/fa";
import Logo from "../../assets/images/AppLogo3D.png";
import Title from "../../assets/images/AppTitle3D.png";
import { useNavigate } from 'react-router-dom';

export default function Header()
{
    const navigate = useNavigate();
    return (
        <>
            <div className='HeaderPortion'>
                <span className='LogoTitle'>
                    <button onClick={() => navigate('/') }>
                        <img src={Logo} alt="Logo" height={70}  />
                    </button>
                    <button onClick={() => navigate('/') }>
                        <img src={Title} alt="Title" height={200} />
                    </button>
                </span>
                <button style={{right:45}} onClick={() => navigate('/cart')}>
                    <CartButton size={35}/>
                </button>
                <button style={{right:0}} onClick={() => navigate('/profile')}>
                    <ProfileButton size={35}/>   
                </button>
                <div className='SearchBox' >
                    <input name='SearchInput' id='searchinput' placeholder='Search' style={{flex: 1, minWidth: 0}}/>
                    <button type="button" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <SearchIcon size={28} style={{color: "#000"}}/>
                    </button>
                </div>
            </div>
        </>
    )
}