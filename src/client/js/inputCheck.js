function checkInput(leavingCity, destCity) {
  let urlRGEX = /^[a-zA-Z\s]{0,255}$/;
  if (urlRGEX.test(leavingCity) && urlRGEX.test(destCity)) {
    return
  } else {
    alert("please enter a valid name");
  }
}

export { checkInput }