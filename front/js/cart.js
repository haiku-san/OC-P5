let cartItemsList = document.getElementById("cart__items");

console.log(localStorage);

showInCart().catch(function(err) {
    console.log(err)
});

async function showInCart() {
    for(item in localStorage) {
        productInCart = JSON.parse(localStorage.getItem(item));
        if(productInCart) {
            console.log(productInCart);
            console.log(productInCart[0].name);
            let newItemCard = document.createElement("article");
            newItemCard.setAttribute("class", "cart__item");
            newItemCard.setAttribute("data-id", `${productInCart[0].id}`);
            newItemCard.setAttribute("data-color", `${productInCart[0].color}`);
            newItemCard.innerHTML = `<div class="cart__item__img"> <img src="${productInCart[0].imageUrl}" alt="${productInCart[0].altTxt}"> </div> <div class="cart__item__content"> <div class="cart__item__content__description"> <h2>${productInCart[0].name}</h2> <p>${productInCart[0].color}</p> <p>${productInCart[0].price.toFixed(2)} €</p> </div> <div class="cart__item__content__settings"> <div class="cart__item__content__settings__quantity"> <p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart[0].quantity}" > </div> <div class="cart__item__content__settings__delete"> <p class="deleteItem">Supprimer</p> </div> </div> </div>`;
            cartItemsList.appendChild(newItemCard);
    
        }
    }
}

window.onload = function() {
    let modifyQuantityInput = [];
    for(item in cartItemsList) {
        modifyQuantityInput = document.querySelector("input[name='itemQuantity']");
        modifyQuantityInput.addEventListener("change", modifyItemQuantity, false);
    }
  
}

async function modifyItemQuantity() {
   let itemQuantityInput = document.querySelector("input[name='itemQuantity']");
   itemQuantityValue = itemQuantityInput.getAttribute("value");
   console.log(`the new item quantity is ${itemQuantityValue}`)
}



/* <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
    <div class="cart__item__img">
        <img src="../images/product01.jpg" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>Nom du produit</h2>
            <p>Vert</p>
            <p>42,00 €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div>
    </div>
</article> */