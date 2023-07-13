import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Signin from './pages/Signin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
