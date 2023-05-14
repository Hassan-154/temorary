import "./App.css";
import React, { useEffect } from "react";
import NewOrderComp from "./order/NewOrder";
import AllProductsComp from "./product/AllProducts";
import AllOrdersComp from "./order/AllOrders";
import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { TextField } from "@mui/material";
import Utils from "./Utils";
import { editOrder, orderId, ordersData, RefreshOrder, SetEditOrder, SetOrderId } from "./LoginPage";
import { useNavigate } from "react-router-dom";
import { ReadyForCheckout } from "./ReadyForCheckout";
import { BiShoppingBag } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';
import './navbar/navbar.scss'
function MainpageComp() {
  
  // Data
  const cartData = useSelector(state => state.cart);
  const totalToPay = useSelector(state => state.totalToPay);
  const userDataStore = useSelector(state => state.userData);

  const [callToPay, setCallToPay] = useState(true);
  const [date, setDate] = useState(new Date());

  const [isProducts, setIsProducts] = useState(false);
  const [isOrders, setIsOrders] = useState(false);
  const [isNewOrders, setIsNewOrders] = useState(true);

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const orderUrl = "http://localhost:8000/api/order";

  // Functions
  const AddNewOrder = async()=>{

    let obj = {
      products : cartData,
      fname : userDataStore.fname,
      lname : userDataStore.lname,
      phone : userDataStore.phone,
      secendPhone : userDataStore.secendPhone,
      address : userDataStore.address,
      city : userDataStore.city,
      note : userDataStore.note,
      delivery : userDataStore.delivery,
      total : totalToPay,
      createAt : GetDateNow(),
      createBy : sessionStorage.username,
      status: 'Accepted',
      callToPay: callToPay,
      trackingNum : ordersData.length + 1000,
      readyTo : date
    }
    if(!userDataStore.delivery){
      obj.delivery = 'Pickup'
    }

    let valid = ReadyForCheckout(obj);    
    if(!valid){
      return;
    }
    
    await Utils.postData(orderUrl, obj);
    alert('Order successfully received');
    await RefreshOrder();                
    
    dispatch({type: "RESETCART"}) 
    dispatch({type: "RESETUSERDATA"}) 
  }

  const CancelChange = async()=>{  
    SetOrderId('');     
    SetEditOrder(false);     
    dispatch({type: "RESETCART"}) 
    dispatch({type: "RESETUSERDATA"})                
  }

  const UpdateOrder = async()=>{
    let obj = {
      products : cartData,
      fname : userDataStore.fname,
      lname : userDataStore.lname,
      phone : userDataStore.phone,
      secendPhone : userDataStore.secendPhone,
      address : userDataStore.address,
      city : userDataStore.city,
      note : userDataStore.note,
      delivery : userDataStore.delivery,
      total : totalToPay,
      updateAt : GetDateNow(),
      updateBy : sessionStorage.username,
      callToPay: callToPay,
      readyTo : date
    }
    
    if(!ReadyForCheckout(obj)){
      return;
    }
    await Utils.putData(orderUrl + '/' + orderId, obj);
    await RefreshOrder();
    SetEditOrder(false);  
    
    SetOrderId(''); 
    dispatch({type: "RESETCART"}) 
    dispatch({type: "RESETUSERDATA"}) 
  }

  function GetDateNow(){
    let date  = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
     return h + ':' + min + ':' + sec + ' - ' + d + '.' + m + '.' + y;
  }


  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


  const [showLinks, setShowLinks] = useState(false);

  const handleClick = () => {
    setShowLinks(!showLinks);
  };
  
  return (
    <div className="web"> 

     <div className="nav">
     <nav>
      <div className="logo">
        <BiShoppingBag size={32}/>
      </div>
      <div className={showLinks ? 'nav-links show' : 'nav-links'}>
        <li>
        <a
                className="nav-link"
                onClick={() => {
                  setIsNewOrders(true);
                  setIsOrders(false);
                  setIsProducts(false);
                }}
              >
                New Order
              </a>
        </li>
        <li>
        <a
                className="nav-link"
                onClick={() => {
                  setIsNewOrders(false);
                  setIsOrders(true);
                  setIsProducts(false);
                }}
              >
                All orders
              </a>
        </li>
        <li>
        <a
                className="nav-link"
                onClick={() => {
                  setIsNewOrders(false);
                  setIsOrders(false);
                  setIsProducts(true);
                }}
              >
                Products
              </a>
        </li>
        <li>
        <a
                className="nav-link"
                onClick={() => {
                  sessionStorage.clear();
                  dispatch({type: "RESETCART"});
                  navigate('/');
                }}
              >
                Log Out
              </a>
        </li>
        <li><button onClick={openModal}>Create Order</button></li>
      </div>
      <div className="burger" onClick={handleClick}>
        <FiMenu size={30}/>
      </div>
    </nav>
     </div>
     
      <div className=" text-center">

        <div className="">
          {isProducts && <AllProductsComp />}

          {isOrders && (
            <AllOrdersComp
              setIsOrders={(cb) => setIsOrders(cb)}
              setIsNewOrders={(cb) => setIsNewOrders(cb)}
              setIsProducts={(cb) => setIsProducts(cb)}
            />
          )}
          {isNewOrders && (
            <NewOrderComp
              setIsOrders={(cb) => setIsOrders(cb)}
              setIsNewOrders={(cb) => setIsNewOrders(cb)}
              setIsProducts={(cb) => setIsProducts(cb)}
            />
          )}
          
        </div>
      </div>

      <div>
      {isOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div>        
      <div className=''>


<div className="model-input">
<input type="text" id="name" name="name" placeholder="Enter your first name" value={userDataStore.fname} onChange={(e)=> dispatch({type: "UPDATEUSERDATA", payload : {...userDataStore, fname : e.target.value}}) }/>
<input type="text" id="name" name="name" placeholder="Enter your last name" value={userDataStore.lname} onChange={(e)=> dispatch({type: "UPDATEUSERDATA", payload : {...userDataStore, lname : e.target.value}}) }/>
</div>

<div className="model-input model-second-input">
<input type="text" id="name" name="name" placeholder="Enter your phone" value={userDataStore.phone} onChange={(e)=> dispatch({type: "UPDATEUSERDATA", payload : {...userDataStore, phone : e.target.value}}) } />
</div>

<div className="model-input model-second-input text-area">
<textarea rows="4" cols="100" value={userDataStore.note} onChange={(e)=> dispatch({type: "UPDATEUSERDATA", payload : {...userDataStore, note : e.target.value}}) } label="note" placeholder="הערות"></textarea>
</div>
  
  <div className="model-date-button">
  <input type="date" pattern="dd/mm/yy" onChange={(e)=> setDate(e.target.value)}/>
        <button variant="outline-primary" onClick={AddNewOrder}>Create order</button>
        {
          editOrder && <button variant="outline-primary" onClick={CancelChange}>Cancel</button>
        }
  </div>

      </div>
            </div>
          </div>
        </div>
      )}
    </div>


      <div className=''>
        {
          totalToPay > 0 && <h4>Total: {Math.floor(totalToPay)}</h4>
        }
          <Table striped bordered hover aria-sort="price">
            {
              cartData.map((item, index) => {
                return<tr key={index}>
                  <img  width='15px' src="https://img.icons8.com/ios/50/null/cancel.png" onClick={()=>{                 
                      dispatch({type: "REMOVEFROMCART", payload : item}) 
                    }}/><br/>
                      <input style={{maxWidth:'50px'}}  type='number' value={item.amount} onChange={(e)=>{dispatch({type: "SETAMOUNT", payload : {item :item, amount : e.target.value}})}}/><br/>
                
                  <td className="cart-detail-note">                
                    {item.name}<br/>
                    {item.price}<br/><br/>
                    <input type='text' placeholder="Note" onChange={(e)=>{                  
                      dispatch({type: "ADDNOTETOPRODUCT", payload : {id: item.id, note : e.target.value}})
                    }} /></td>
                    
                  </tr>
              })
            }
          </Table>
      </div>
    </div>
  );
}

export default MainpageComp;