import {isLogged, logoutUser, useUser} from "../Authorization";
import {useHistory} from "react-router-dom";

export default function UserLogout() {
    let user = useUser();
    let history = useHistory();
    if (isLogged(user)) {
        logoutUser(user).then(() => history.goBack()).catch(console.log);
    }
    return null;
}