import { Routes, Route } from "react-router-dom";
import SignUp from "../components/SignupMUI";
import Homepage from "../pages/Homepage";
import UsersPage from "../pages/UsersPage";
import ForgotPassword from "../components/ForgotPassword";

function AppRoutes(props) {

    return (
        <Routes>
            <Route index element={<Homepage {...props} />} />
            <Route path="signup" element={<SignUp {...props} />} />
            <Route path="forgotpw" element={<ForgotPassword {...props} />} />
            <Route path="users" element={<UsersPage {...props} />} />
        </Routes>
    );
}

export default AppRoutes