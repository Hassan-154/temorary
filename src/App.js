import "./App.css";
import MainpageComp from "./Mainpage";
import EditOrderComp from "./order/EditOrder";
import LoginPageComp from "./LoginPage";
import { Route, Routes } from "react-router-dom";
import EditProductComp from "./product/EditProduct";
import AddProductComp from "./product/AddProduct";
import Home from "./Home";
import Navbar from './navbar/Navbar'
function App() {


  return (
    <div className="">
      <Routes>
      {/* <Route path="/" element={<LoginPageComp />} /> */}
      {/* <Route path="/" element={<LoginPageComp />} /> */}
      {/* <Route path="/" element={<Navbar />} /> */}
      <Route path="/" element={<MainpageComp />} />
        <Route path="/editorder/:id" element={<EditOrderComp />} />
        <Route path="/editproduct/:id" element={<EditProductComp />} />
        <Route path="/newproduct" element={<AddProductComp />} />
      </Routes>
    </div>
  );
}

export default App;