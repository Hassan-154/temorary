import "../App.css";
import Utils from "../Utils";

import { Button, Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { RefreshOrder, RefreshProducts } from "../LoginPage";

function EditProductComp() {

  // Data
  const [productObj, setProductObj] = useState({});
  const editProduct  = useSelector(state => state.editProduct);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productUrl = "http://localhost:8000/api/product";

  // Functions
  
  useEffect(()=>{
    SetData();
  }, []);

  const SetData = async() => {
    setTimeout(() => { 
      setProductObj(editProduct);   
    }, 50);
  };
  
  const updateProduct = async () => {
    await Utils.putData(productUrl + '/' + productObj.id, productObj);
    alert('Updated !');
    await RefreshProducts();
    navigate("/main");

  };

  const cancel = async() => {    
    dispatch({type: "CLEAREDITPRODUCT"});    
    navigate("/main");
  };

  const deleteProduct = async() => {    
    dispatch({type: "CLEAREDITPRODUCT"});    
    await Utils.deleteData(productUrl + '/' + productObj.id);
    alert('Deleted');
    await RefreshProducts();
    navigate("/main");
  };


  return (<div className="edit-order">
      <h3>{productObj.name}  </h3>
        <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "100ch" }, }} noValidate autoComplete="off" >
        <TextField id="standard-basic" label="Name" value={productObj.name}
            onChange={(e) => setProductObj({ ...productObj, name: e.target.value })}
             variant="outlined"
          />
          <TextField id="standard-basic" label="Category" value={productObj.categorie}
          onChange={(e) => setProductObj({ ...productObj, categorie: e.target.value })}
           variant="outlined"
        />        
        <TextField  type='number' label="Price" value={productObj.price}
          onChange={(e) => setProductObj({ ...productObj, price: parseInt(e.target.value) })}
           variant="outlined"
        />
        <TextField type='number' label="Quantity" value={productObj.quantity}
          onChange={(e) => setProductObj({ ...productObj, quantity: parseInt(e.target.value) })}
           variant="outlined"
        />  
        <TextField id="standard-basic" label="Menu" value={productObj.menu}
          onChange={(e) => setProductObj({ ...productObj, menu: e.target.value })}
           variant="outlined"
        />
          <br />
        </Box>
        
      <input type="button" value={'Delet'} onClick={deleteProduct} />
      <input type="button" value={'Cancel'} onClick={cancel} />
      <input type="button" value={'Save'} onClick={updateProduct} />

      </div>
  );
}

export default EditProductComp;