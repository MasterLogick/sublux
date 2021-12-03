import {logoutUser, useUser} from "../Authorization";
import {useHistory} from "react-router-dom";

export default function UserLogout() {
    let user = useUser();
    let history = useHistory();
    logoutUser(user).then(() => history.goBack()).catch(err => alert(err));
    return null;
}