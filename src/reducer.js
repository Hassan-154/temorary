function SetTotal(cart) {
  let num = 0;
  for (let i = 0; i < cart.length; i++) {
    const element = cart[i];
    num = num + element.price * element.amount;
  }
  return num;
}
function reducer(
  state = {
    orders: [],
    products: [],
    cart: [],
    userData: {},
    editOrder: {},
    editProduct: {},
    totalToPay: 0,
    delivery : false

  },
  action
) {
  switch (action.type) {
    case "ADDTOCART":
      action.payload.amount = 1;
      let flag = true;
      if (state.cart.length > 0) {
        for (let i = 0; i < state.cart.length; i++) {
          if (state.cart[i].id === action.payload.id) {
            flag = false;
            break;
          }
        }
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
          totalToPay:
            state.totalToPay + action.payload.price * action.payload.amount,
        };
      }
      if (flag) {
        return {
          ...state,
          cart: [...state.cart, action.payload],
          totalToPay:
            state.totalToPay + action.payload.price * action.payload.amount,
        };
      } else {
        return { ...state };
      }

    case "INCREMENTAMOUNT":
      let arr2 = [...state.cart];
      let index = arr2.findIndex((x) => x.id == action.payload.id);
      if (index >= 0) {
        arr2[index].amount = arr2[index].amount + 1;
      }
      return { ...state, cart: arr2, totalToPay: SetTotal(state.cart) };

    case "SETAMOUNT":
    let arr4 = [...state.cart];
    let index3 = arr4.findIndex((x) => x.id == action.payload.item.id);
    if (index3 >= 0) {
      arr4[index3].amount = action.payload.amount;
    }
    return { ...state, cart: arr4, totalToPay: SetTotal(state.cart) };


    case "EDITORDER":
      return { ...state, editOrder : action.payload };
    
    case "CLEAREDITORDER":
      return { ...state, editOrder : {} };
      
    case "EDITPRODUCT":
      return { ...state, editProduct : action.payload };
    
    case "CLEAREDITPRODUCT":
      return { ...state, editProduct : {} };
      
    case "ADDNOTETOPRODUCT":
      let sCart = [...state.cart];
      let prod = sCart.find(x=>x.id == action.payload.id);
      if(prod){
        prod.note = action.payload.note;
      }
      return { ...state, cart : state.cart };
        
    case "DECREMENTAMOUNT":
      let arr3 = [...state.cart];
      let index2 = arr3.findIndex((x) => x.id == action.payload.id);
      if (index2 >= 0) {
        if (arr3[index2].amount <= 1) {
          arr3.splice(index2, 1);
          return { ...state, cart: arr3, totalToPay: SetTotal(arr3) };
        } else {
          arr3[index2].amount = arr3[index2].amount - 1;
        }
      }
      return { ...state, cart: arr3, totalToPay: SetTotal(arr3) };

    case "REMOVEFROMCART":
      let arr = [...state.cart];
      for (let i = 0; i < arr.length; i++) {
        let index = state.cart.findIndex((x) => x.id == action.payload.id);
        if (index >= 0) {
          arr.splice(index, 1);
          break;
        }
      }
      return { ...state, cart: arr, totalToPay: SetTotal(arr) };

    case "RESETCART":
      return { ...state, cart: [], totalToPay: 0 };

    case "UPDATEUSERDATA":
        return { ...state, userData: action.payload};

    case "RESETUSERDATA":
          return { ...state, userData: {
            fname : '',
            lname : '',
            phone : '',
            secendPhone : '',
            address : '',
            city : '',
            note : ''

          }};

    case "SETDELIVERY":
      return { ...state, delivery : action.payload }


    default:
      return state;
  }
}

export default reducer;