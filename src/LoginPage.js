import "./App.css";
import '../src/style/login.scss'
import Utils from "./Utils";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export let productsData = [];
export let ordersData = [];
export let editOrder = false;
export let orderId = '';
export function SetOrderId(id){
  orderId = id;
}
export function SetEditOrder(bool){
  editOrder = bool;
}

const productUrl =  "http://localhost:8000/api/product";
const orderUrl = "http://localhost:8000/api/order";

export async function RefreshProducts(){    
  let respProducts = await Utils.getData(productUrl);
  productsData = respProducts.data;
}
export async function RefreshOrder(){    
  let respOrders = await Utils.getData(orderUrl);
  ordersData = respOrders.data;
}

function LoginPageComp() {

  // Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msgErr, setMsgErr] = useState("");
  const userUrl = "http://localhost:8000/api/login";
  const navigate = useNavigate();

  // Functions

  const login = async () => {
    
    let obj = {
      username: username,
      password: password,
    };
    let resp = await Utils.postData(userUrl, obj);
    if(resp.status == 200 && resp.data){
      sessionStorage['username'] = resp.data.userData.username;
      sessionStorage['token'] = resp.data.token;
      sessionStorage['role'] = resp.data.userData.role;

      await RefreshProducts();
      await RefreshOrder();

      navigate("/main");
    }else{      
      setMsgErr("Incorrect username or password");
    }
  };


  return (
    <div className="containerr">
      <div className="login">
      <h1>Account Login</h1>
      {msgErr}
      <br />
      <TextField
        style={{ marginBottom: "10px" }} id="standard-basic" label="Username" placeholder="Username"
        onChange={(e) => setUsername(e.target.value)} variant="outlined"
      />
      <br />
      <TextField
        style={{ marginBottom: "30px" }}
        type="password"
        label="Password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
      />
      <Button className="login-button" onClick={login}>
        Login
      </Button>
      <br />
    </div>
    </div>
  );
}

export default LoginPageComp;