import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "pages/Home";
import SignUp from "pages/Signup";
import SignIn from "pages/Signin";
import ProtectLayout from "components/Layout/ProtectLayout";
import AuthProtectLayout from "components/Layout/AuthProtectLayout";
import UpdatePassword from "pages/UpdatePassword";
import NotFound from "pages/NotFound";

import ProductDetail from "pages/ProductDetail";
import NewProduct from "pages/CreateProduct";
import EditProduct from "pages/EditProduct";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route element={<AuthProtectLayout />}>
                        <Route path="signup" element={<SignUp />} />
                        <Route path="signin" element={<SignIn />} />
                        <Route path="updatePassword" element={<UpdatePassword />} />
                    </Route>
                    <Route element={<ProtectLayout />}>
                        <Route path="/products/:productId" element={<ProductDetail />}></Route>
                        <Route path="/new-product" element={<NewProduct />}></Route>
                        <Route
                            path="/user/:id/edit-product/:productId"
                            element={<EditProduct />}
                        ></Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
