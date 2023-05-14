import "../App.css";
import Utils from "../Utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { RefreshProducts } from "../LoginPage";
import { productsData } from "../LoginPage";
import { Button } from "react-bootstrap";

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function AddProductComp(props) {

  // Data
  const [newProduct, setNewProduct] = useState({});

  const [categorieVal, setCategorieVal] = useState("");
  const [menuVal, setMenuVal] = useState("");
  const [quantityTypeVal, setQuantityTypeVal] = useState("");

  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  const [quantityType, setQuantityType] = useState([]);

  const navigate = useNavigate()
  const productUrl = "http://localhost:8000/api/product";

  // Functions
  useEffect(()=>{
    
    let categorieData = productsData.map(x=>x.categorie)
    let categorieDataSorted = categorieData.sort();
    uniq = [...new Set(categorieDataSorted)];
    setCategories(uniq);
    
    let menuData = productsData.map(x=>x.menu);
    let menuDataSorted = menuData.sort();
    uniq = [...new Set(menuDataSorted)];
    setMenu(uniq);
    
    let quantityType = productsData.map(x=>x.quantityType)
    let quantityTypeSorted = quantityType.sort();
    uniq = [...new Set(quantityTypeSorted)];
    setQuantityType(uniq);
    
  }, [])
  const addProduct = async () => {
    
    await Utils.postData(productUrl, newProduct);
    alert('Product Added !');
    await RefreshProducts();
    navigate("/main");
    
  };
  
  const cancel = async() => {    
    navigate("/main");
  };


  return (
    <div className="AddComp">
      <h3>Add new product</h3>
      
      <h3>{newProduct.name}  </h3>
    <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "100ch" }, }} noValidate autoComplete="off" >

        <div className='mw-120'>
          <TextField id="standard-basic" label="Name" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              variant="outlined"
            /> <p></p>

          <TextField type='number' label="Price" value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
              variant="outlined"
          /> <p></p>

          <TextField type='number' label="Quantity" value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
              variant="outlined"
          /> <p></p>
          
          <p></p>
          Category: 
          <Select 
            value={categorieVal}
            width='30px'
            label="Category"
            onChange={(e) => {
              setNewProduct({ ...newProduct, categorie: e.target.value })
              setCategorieVal(e.target.value);
              } 
            }
          >
            {
              categories && categories.map((item, index)=>{
                return<MenuItem key={index} value={item}>{item}</MenuItem>
              })
            }
          </Select><p></p>


        Menu: 
        <Select
          value={menuVal}
          label="Menu"
          onChange={(e) => {
            setNewProduct({ ...newProduct, menu: e.target.value })
            setMenuVal(e.target.value);
            } 
          }
        >
          {
            menu && menu.map((item, index)=>{
              return<MenuItem key={index} value={item}>{item}</MenuItem>
            })
          }
        </Select>
      </div>
      
    </Box>
    <Button variant="outline-primary" onClick={cancel}>Cancel</Button>
    <Button variant="outline-primary" onClick={addProduct}>Save</Button>

    </div>
  );
}

export default AddProductComp;