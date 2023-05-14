export function ReadyForCheckout(order){
  
  if(order.fname == undefined || order.lname == undefined || order.phone == undefined){
    alert('חסרים פרטי איש קשר');
    return false;
  }

  if(order.fname == '' || order.lname == '' || order.phone == ''){
    alert('חסרים פרטי איש קשר');
    return false;
  }
  
  if(order.products == undefined || order.products == [] || order.products.length == 0){
    alert('אין מוצרים בסל');
  return false;
}
  return true;
}