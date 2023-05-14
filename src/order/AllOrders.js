import "../App.css";
import Utils from "../Utils";
import Table from "react-bootstrap/Table";
import React, { useState, useRef, useEffect } from "react";
import { ordersData } from "../LoginPage";
import { useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { FiSearch } from 'react-icons/fi';

function AllOrdersComp() {

  // Data
  const [allOrder, setAllOrder] = useState([]);
  const [temp, setTemp] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const [del, setDel] = useState("Delivery");
  const [filterButtonVal, setFilterButtonVal] = useState("הצג כל ההזמנות");
  const [filterVal, setFilterVal] = useState("Completed");
  const [print, setPrint] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const componentRef = useRef();
  const componentRefWithoutPrice = useRef();
  const orderUrl = "http://localhost:8000/api/order";

  // Functions
  useEffect(()=>{
    setAllOrder(ordersData)
  }, [])
  
  useEffect(()=>{
    setAllOrder(ordersData)
  }, [print])

  const handlePrint = useReactToPrint({    
    content: () => componentRef.current,
    onBeforePrint: () => {document.title = `דוח הזמנות`},
    onAfterPrint: () => {document.title = `אבי מלכא אירועים`},
    pageStyle: () => `{   
                          margin: 50mm 50mm 50mm 50mm;
                          width: 80mm;
                          height: 100%;
                      }`
    
  });

  const filterTable = async() => {    
    let resp = await Utils.postData(orderUrl + '/filterorder', {from : from, to : to});
    setAllOrder(resp.data)
  }

  const ShowAllOrders = () => {
    setAllOrder(ordersData)
    setShowAllOrders(!showAllOrders)
    if(showAllOrders){
      setFilterVal('');
      setFilterButtonVal("הסתר הזמנות שהושלמו")
    }else{      
      setFilterVal('Completed');
      setFilterButtonVal("הצג הזמנות שהושלמו")
    }
  };


  const search = async(e) => {
    if (e.target.value.length >= 1) {
      setSearchVal(e.target.value);
    }else{           
      setSearchVal('');
    }
  };

  return (
      <div className="new-order">

        <div className="date">
          <div className="left-form">
          From: <input type="date" onChange={e=>setFrom(e.target.value)}/>
          To: <input type="date" onChange={e=>setTo(e.target.value)}/>
          <input type="button" value="Show" onClick={filterTable}/>
          </div>
          <div className="right-button">
          <button type="button" style={{float:'right', margin : '5px'}} className="bg-gray-500 border border-gray-500 p-2 mb-4" onClick={handlePrint} >
            {" "} Print {" "}
          </button>
          </div>
        </div>
      
      <div className="search-bar all-order-search">
      <FiSearch className="icon" size={32} />
      <input type="text" placeholder="Search..."
      id="standard-basic"
            label="Search"
            onChange={search}
            variant="standard"
      ></input>
      </div>
       
      <div style={{diraction : 'rtl'}} className="all-order-table"  ref={componentRef}>

        <>
          <Table striped bordered hover >
      
            <div class="grid-all-order">
		<div class="item-all-order">#</div>
		<div class="item-all-order">Order Id</div>
		<div class="item-all-order">Name</div>
		<div class="item-all-order">Status</div>
    <div class="item-all-order">Total</div>
		<div class="item-all-order">Created By</div>
		<div class="item-all-order">Edit</div>
		<div class="item-all-order">Print</div>
	</div>
            <tbody>
              {allOrder
              .filter(x=>
                searchVal.length > 0 ? x.fname && x.fname.toLocaleLowerCase().includes(searchVal) || x.lname && x.lname.toLocaleLowerCase().includes(searchVal)
                : x.fname && x.fname.toLocaleLowerCase().includes(searchVal) || x.lname && x.lname.toLocaleLowerCase().includes(searchVal))
              .sort((a, b)=>a.readyTo.substring(5, 10).replace('-', '') - b.readyTo.substring(5, 10).replace('-', ''))
              .map((item, index) => {
                return (
                  <tr key={index} className={(item.status == 'Completed') ? 'orderComplete' : 'orderNotComplete'}>
                    <td>{index +1}</td>                  
                    <td>{item.trackingNum}</td>                  
                    <td>{item.fname + ' ' + item.lname}</td>                   
                    <td>{item.status}</td>       
                    <td>{item.callToPay ? 'לא שולם' : 'שולם'}</td>       
                    <td>{item.readyTo.substring(0, 10)}</td>          
                    <td>{item.total}</td>                 
                    <td>{item.createBy}</td>                 
                    <td>{<input type="button" value="Edit" onClick={async ()=>{ 
                      let resp = await Utils.getData(orderUrl + '/' + item.id);
                      dispatch({type: "EDITORDER", payload : resp.data}) 
                      navigate('/editorder/' + item.id);
                    }}/>}</td> 
                    <td>{<input type="button" value="Print" onClick={async ()=>{ 
                      let resp = await Utils.getData(orderUrl + '/' + item.id);
                      setTemp(resp.data)
                      setPrint(true)
                    }}/>}</td>            
                                              
                  </tr>
                );
              })}
            </tbody>
          </Table>
        
        </> 
      </div>
      </div>
  );
}

export default AllOrdersComp;