import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from 'pages/Home';
import SignUp from 'pages/Signup';
import SignIn from 'pages/Signin';
import ProtectLayout from 'components/Layout/ProtectLayout';
import ProductDetail from 'pages/Product/ProductDetail';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='signup' element={<SignUp />} />
                    <Route path='signin' element={<SignIn />} />
                    <Route path='/products/:productId' element={<ProductDetail/>}></Route>
                    <Route element={<ProtectLayout />}>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
{
    /* <Route */
}
// path='/api/products/:id'
// element={<ProductDetail />}
// />
// </Route>
