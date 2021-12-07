import {isLogged, logoutUser, useUser} from "../Authorization";
import {useNavigate} from "react-router-dom";

export default function UserLogout() {
    let user = useUser();
    let navigate = useNavigate();
    if (isLogged(user)) {
        logoutUser(user).then(() => navigate(-1)).catch(console.log);
    }
    return null;
}