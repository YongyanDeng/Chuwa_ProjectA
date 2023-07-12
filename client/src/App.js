import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SignUp from "./pages/Signup";
import Signin from "./pages/Signin";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="signup" element={<SignUp />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
