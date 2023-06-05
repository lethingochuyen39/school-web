import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Success = () =>{
    const location = useLocation();
    const navigate = useNavigate();
    // const { login } = useContext(AuthContext);
    const check = async () => {
        const cookies = new Cookies();
        const token = await cookies.get('token');
        
        if( token !== location.state?.token || token === null||  token === undefined) {
            navigate('/login');
        }else{
            return true;
        }
    }
    if(check()){
        if(location.state?.jwtDecode?.roles[0]==='STUDENT'){
            return (
                <div>
                    STUDENT
                </div>
            )
        }
        if(location.state?.jwtDecode?.roles[0]==='TEACHER'){
            return (
                <div>
                    TEACHER
                </div>
            )
        }
        if(location.state?.jwtDecode?.roles[0]==='PARENTS'){
            return (
                <div>
                    PARENTS
                </div>
            )
        }else{
            return (
                <div>fail</div>
            )
        }
    }
}
export default Success;