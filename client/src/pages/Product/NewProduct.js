import React from "react";
import ProductForm from 'components/ProductForm';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProductAction } from "app/productSlice";

export default funciton NewProduct(){
    const {user} = useSelector(state => state.user);
    const navigate =useNavigate();
    const dispatch =useDispatch();

    const onSubmit = data =>{
        dispatch(createProductAction({userId: user.id, text:data.text})
        ).then(()=>{
            navigate('/');
        });
    };
    return <ProductForm onSubmit={onSubmit}/>;
}