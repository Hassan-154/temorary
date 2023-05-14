import "../App.css";
import Utils from "../Utils";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Box, TextField } from "@mui/material";
import { productsData, RefreshOrder } from "../LoginPage";
import { useReactToPrint } from "react-to-print";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


function NewOrderComp(props) {
  // Data
  const [isAddNewProd, setIsAddNewProd] = useState(false);
  const orderUrl = "http://localhost:8000/api/order";
  const [buttonVal, setButtonVal] = useState("");
  const [productsIDArr, setProductsIDArr] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editOrder  = useSelector(state => state.editOrder);
  const [orderObj, setOrderObj] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const [day, setDay] = useState()
  const [totalToPay, setTotalToPay] = useState(0);  
  const componentRef = useRef();
  const componentRefWithoutPrice = useRef();

  // Functions  
  useEffect(()=>{
    if(props.type == 'print'){
      printAuto()
    }
  }, [])

  const printAuto = (props)=>{
    handlePrintWithoutPrice()
  }

  const handlePrintWithoutPrice = useReactToPrint({    
    content: () => componentRefWithoutPrice.current,
    onBeforePrint: () => {document.title = `${orderObj.trackingNum} - ${orderObj.fname} ${orderObj.lname}`},
    onAfterPrint: () => {document.title = `אבי מלכא אירועים`},
    pageStyle: () => `{   
                          margin: 50mm 50mm 50mm 50mm;
                          width: 80mm;
                          height: 100%;
                          diraction : rtl;  
                      }`
    
  });

  const handlePrint = useReactToPrint({    
    content: () => componentRef.current,
    onBeforePrint: () => {document.title = `${orderObj.trackingNum} - ${orderObj.fname} ${orderObj.lname}`},
    onAfterPrint: () => {document.title = `אבי מלכא אירועים`},
    pageStyle: () => `{   
                          margin: 50mm 50mm 50mm 50mm;
                          width: 80mm;
                          height: 100%;
                          diraction : rtl;  
                      }`
    
  });

  useEffect(()=>{
    if(isAddNewProd == false)(
      setButtonVal("הצג מוצרים")
    )
    if(isAddNewProd == true)(
      setButtonVal("הסתר מוצרים")
    )
  }, [isAddNewProd]);

  useEffect(()=>{
    SetData();
    let total = 0;
    for (let i = 0; i < editOrder.products.length; i++) {
      const element = editOrder.products[i];
      total = total + (element.price * element.amount)      
    }
    setTotalToPay(total);
  }, []);

  const SetData = async() => {
    setTimeout(() => {
      setOrderObj(editOrder);     
      let idArr = editOrder.products.map(x=>x.id);
      setProductsIDArr(idArr);
      
    }, 500);
  };

  const cancel = async() => {
    dispatch({type: "CLEAREDITORDER"});    
    await SetData();                
    navigate("/main");
  };

  const search = async(e) => {
    if (e.target.value.length >= 1) {
      setSearchVal(e.target.value);
    }else{           
      setSearchVal('');
    }
  };

  const updateOrder = async () => {
    for (let i = 0; i < orderObj.products.length; i++) {
      const element = orderObj.products[i];
      if(element.amount == 0 || element.amount == null){
        orderObj.products.splice(i, 1);
        i--;
      }
      
    }
    await Utils.putData(orderUrl + '/' + editOrder.id, orderObj);
    alert('הזמנה עודכנה בהצלחה');
    await RefreshOrder();
    navigate("/main");

  };

  const addNewProduct = () => {
    setIsAddNewProd(!isAddNewProd);
  };

  const CalcTotal = () => {
    let num = 0;
    for (let i = 0; i < orderObj.products.length; i++) {
      const element = orderObj.products[i];
      num = num + (element.price * element.amount);
    }
    
    return num;
  };
  
  const deleteOrder = async() => {       
    await Utils.deleteData(orderUrl + '/' + orderObj.id);
    alert('Deleted');
    await RefreshOrder();
    navigate("/main");
  };


  return (
    <div className="edit-order">
      

      <h3>פרטי לקוח - {orderObj.trackingNum} - {totalToPay} ש"ח</h3>
      <h5>יום { orderObj.day} - {orderObj.readyTo && orderObj.readyTo.substring(8, 10)}.{orderObj.readyTo && orderObj.readyTo.substring(5, 7)}.{orderObj.readyTo && orderObj.readyTo.substring(0, 4)} </h5>

      <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" }, }} noValidate autoComplete="off" >
        <TextField
          id="standard-basic"
          label="שם פרטי"
          value={orderObj.fname}
          onChange={(e) => setOrderObj({ ...orderObj, fname: e.target.value })}
          variant="filled"
        />
        <TextField
          id = "standard-basic" label="שם משפחה"
          value={orderObj.lname}
          onChange={(e) => setOrderObj({ ...orderObj, lname: e.target.value })}
          variant="filled"
        />
        <TextField
          id="standard-basic" label="טלפון נוסף"
          value={orderObj.secendPhone}
          onChange={(e) => setOrderObj({...orderObj, secendPhone : e.target.value})}
          variant="filled"
        />
        <br />
        <TextField
          id="standard-basic"
          label="טלפון"
          value={orderObj.phone}
          onChange={(e) => setOrderObj({...orderObj, phone : e.target.value})}
          variant="filled"
        />
        <TextField
          id="standard-basic"
          label="כתובת"
          disabled={orderObj.delivery ? false : true}
          value={orderObj.address}
          onChange={(e) => setOrderObj({...orderObj, address : e.target.value})}
          variant="filled"
        />
        <TextField
          id="standard-basic"
          label="עיר"
          disabled={orderObj.delivery ? false : true}
          value={orderObj.city}
          onChange={(e) => setOrderObj({...orderObj, city : e.target.value})}
          variant="filled"
        />
        <br />
        <TextField
          id="standard-basic"
          label="הערות"
          value={orderObj.note}
          onChange={(e) => setOrderObj({...orderObj, note : e.target.value})}
          variant="filled"
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={orderObj.status}
            label="Status"
            onChange={(e) => setOrderObj({...orderObj, status : e.target.value})}

          >
            <MenuItem value={'Accepted'}>Accepted</MenuItem>
            <MenuItem value={'in treatment'}>in treatment</MenuItem>
            <MenuItem value={'Completed'}>Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Date" type="date" placeholder="Date " id="standard-basic" value={orderObj.readyTo} onChange={(e) => setOrderObj({...orderObj, readyTo : e.target.value})}/>
      </Box>
      <br />
        

      <div style={{float : 'right'}}>
        <input
          type="radio" name="delivery"
          checked={orderObj.delivery === 'Delivery'}
          onChange={(e) => setOrderObj({...orderObj, delivery : 'Delivery'})}
        />
        Delivery
        <br />
        <input
          type="radio"
          name="delivery"
          checked={orderObj.delivery !== 'Delivery'}
          onChange={(e) => setOrderObj({...orderObj, delivery : 'Pickup' })}
        />
        Pickup
      </div>
      
      <div>
            <input type="button" value={buttonVal} onClick={addNewProduct} />
            <input type="button" value={'Cancel'} onClick={cancel} />
            <input type="button" value={'Save'} onClick={updateOrder} />
            <input type="button" value={'Delete'} onClick={deleteOrder} /><br/>
            
          </div>
          
          <br />
          <br />
          

      <Table striped bordered hover aria-sort="price">
            <thead>
              <tr>
                <th>#</th>
                <th>sort</th>
                <th>כמות</th>
                <th>סוג כמות</th>
                <th>שם</th>
                <th>תפריט</th>
                <th>מחיר</th>
                <th>הערות</th>
              </tr>
            </thead>
            <tbody>
              
            {
              orderObj.products && orderObj.products
              .sort(x=>x.sort)
              .map((item, index) => {
                return<tr key={index}>

                    <td>{index + 1}</td>
                    <td>{item.sort}</td>

                    <td>
                      <input style={{width:'80px'}} type="number" value={item.amount} onChange={(e)=>{
                        let arr = [...orderObj.products];
                        let objIndex = arr.findIndex(x=>x.id == item.id);
                        if(objIndex >= 0){
                          arr[objIndex].amount = parseInt(e.target.value);
                        }                      
                        setTotalToPay(CalcTotal)
                        setOrderObj({...orderObj, products : arr});
                      }} />
                    </td>

                    {/* <td className="cart-detail">{item.quantity}</td> */}
                    <td className="cart-detail">{item.quantity + ' ' + item.quantityType}</td>
                    <td className="cart-detail">{item.name}<br/>
                      {item.price}
                    </td>

                    <td className="cart-detail">{item.menu}</td>

                    <td className="cart-detail">Total: {item.price * item.amount}</td>  

                    <td>
                      <input style={{width:'80px'}} type="text" value={item.note} onChange={(e)=>{
                        let arr = [...orderObj.products];
                        let objIndex = arr.findIndex(x=>x.id == item.id);
                        if(objIndex >= 0){
                          arr[objIndex].note = e.target.value;
                        }
                        setOrderObj({...orderObj, products : arr});
                      }} />
                    </td>
                  </tr>
              })
            }
            </tbody>
          </Table>
          סה"כ: {orderObj.products && orderObj.products.length} פריטים
          <br/>


      {
        isAddNewProd && 
        
        <>
        <div className='search-field'>
          <TextField            
              id="standard-basic"
              label="Search"
              onChange={search}
              variant="standard"
            />
        </div>
          <br />
          <br />
          <Table striped bordered hover aria-sort="price">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>תפריט</th>
                <th>מחיר</th>
                <th>מ"ל</th>
                <th>add</th>
              </tr>
            </thead>
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
                    <td>{item.menu}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity + " " + item.quantityType}</td>
                    <td>{<input type="button" value='הוסף' disabled={productsIDArr.includes(item.id)} onClick={()=>
                    {
                      item.amount = 1;
                      setProductsIDArr([...productsIDArr, item.id])
                      setTotalToPay(totalToPay + item.price)
                      setOrderObj({...orderObj, products : [...orderObj.products, item]})
                      
                    }
                      } />}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </> 
      }
    
    </div>
  );
}

export default NewOrderComp;