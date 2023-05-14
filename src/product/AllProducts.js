import "../App.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Table from "react-bootstrap/Table";
import { productsData } from "../LoginPage";
import Utils from "../Utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiSearch } from 'react-icons/fi';


function AllProductsComp() {

  // Data
  const [searchVal, setSearchVal] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const productUrl = "http://localhost:8000/api/product";

  // Functions
  const search = async(e) => {
    if (e.target.value.length >= 1) {
      setSearchVal(e.target.value);
    }else{           
      setSearchVal('');
    }
  };

  return (
    <div className="new-order">
        <div className='search-field'>
        
<div className="search-bar">
      <FiSearch className="icon" size={32} />
      <input type="text" placeholder="Search..."
      id="standard-basic"
            label="Search"
            onChange={search}
            variant="standard"
      ></input>
      </div>
        </div>

        <div className="product">
        <button variant="outline-primary" onClick={()=>navigate('/newproduct')}>New product</button>
        </div>
    
        <>
          <Table striped bordered hover aria-sort="price">
            <div class="grid-all-product">
		<div class="item-all-product">#</div>
		<div class="item-all-product">Name</div>
		<div class="item-all-product">Categorie</div>
		<div class="item-all-product">Price</div>
    <div class="item-all-product">Edit</div>
	</div>
            <tbody>
              {productsData
              .filter(x=>
                searchVal.length > 0 ? x.name && x.name.toLocaleLowerCase().includes(searchVal)
                :x.name && x.name.toLocaleLowerCase().includes(searchVal))
              .map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.categorie}</td>
                    <td>{item.price}</td>
                    <td>{<input type="button" value="Edit" onClick={async ()=>{ 
                      let resp = await Utils.getData(productUrl + '/' + item.id);
                      dispatch({type: "EDITPRODUCT", payload : resp.data}) 
                      navigate('/editproduct/' + item.id);
                    }}/>}</td>                  
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </> 
    </div>
  );
}

export default AllProductsComp;