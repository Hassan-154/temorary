import "../App.css";
import '../style/table.css'
import * as React from "react";
import { Table } from "react-bootstrap";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { productsData } from "../LoginPage";
import { FiSearch } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

function NewOrderComp() {

  // Data
  const [searchVal, setSearchVal] = useState("");
  const [searchCatVal, setSearchCatVal] = useState("תפריט פסח");
  const [categories, setCategories] = useState();
  const dispatch = useDispatch();

  // Functions
  React.useEffect(()=>{
    let setData = ()=>{
      let arr = productsData.map(x=>x.menu)
      let uniq = [...new Set(arr)];
      setCategories(uniq);
    }
    setData();
  }, [])

  const search = async(e)=> {
    if (e.target.value.length >= 1) {
      setSearchVal(e.target.value);
    }else{           
      setSearchVal('');
    }
  };


  return (
    <div className="new-order">

      <div className="search-bar">
      <FiSearch className="icon" size={32} />
      <input type="text" placeholder="Search..."
      id="standard-basic"
            label="Search"
            onChange={search}
            variant="standard"
      ></input>
      </div>

          <br />
          <br />
        <>
          <table striped bordered hover aria-sort="price">
          <h1>Product Details</h1>
          <div className=""></div>
          <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>add</th>
              </tr>
            </thead>
   <tbody>
              {productsData
              .filter(x=>
                searchVal.length > 0 ? x.name && x.name.toLocaleLowerCase().includes(searchVal)
                :x.name && x.name.toLocaleLowerCase().includes(searchVal))
            
              .sort((a, b)=>a.sort - b.sort)
              .map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{<input type="button" value='Add' onClick={()=>                     
                        dispatch({type: "ADDTOCART", payload : item})                        
                      } />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </> 
    </div>
  );
}

export default NewOrderComp;