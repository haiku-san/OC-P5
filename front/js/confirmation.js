let url = new URL(window.location.href)
let orderId = url.searchParams.get("orderId");
console.log(orderId);

const orderIdHtml = document.getElementById("orderId")
orderIdHtml.innerHTML = orderId

localStorage.clear()