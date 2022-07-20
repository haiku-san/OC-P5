let cartItemsList = document.getElementById("cart__items");
let totalItemsInCart = 0;

console.log(localStorage);

showInCart().catch(function(err) {
    console.log(err)
});

async function showInCart() {
    for(item in localStorage) {
        productInCart = JSON.parse(localStorage.getItem(item));
        if(productInCart) {
            let newItemCard = document.createElement("article");
            newItemCard.setAttribute("class", "cart__item");
            newItemCard.setAttribute("data-id", `${productInCart[0].id}`);
            newItemCard.setAttribute("data-color", `${productInCart[0].color}`);
            newItemCard.innerHTML = `<div class="cart__item__img"> <img src="${productInCart[0].imageUrl}" alt="${productInCart[0].altTxt}"> </div> <div class="cart__item__content"> <div class="cart__item__content__description"> <h2>${productInCart[0].name}</h2> <p>${productInCart[0].color}</p> <p>${productInCart[0].price.toFixed(2)} €</p> </div> <div class="cart__item__content__settings"> <div class="cart__item__content__settings__quantity"> <p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart[0].quantity}" > </div> <div class="cart__item__content__settings__delete"> <p class="deleteItem">Supprimer</p> </div> </div> </div>`;
            cartItemsList.appendChild(newItemCard);
            
    
        }
        // countTotalItemsInCart();
        // countTotalPriceInCart();
    }
}

window.onload = function() {
    allQuantityInputs = document.querySelectorAll("input[name='itemQuantity']");
    allQuantityInputs.forEach(element => {
        element.addEventListener("change", modifyItemQuantity, false);
    });
    allQuantityDeleteButtons = document.querySelectorAll("p.deleteItem");
    allQuantityDeleteButtons.forEach(element => {
        element.addEventListener("click", deleteItemInCart, false);
    });
}

async function fetchItemToChange() {
    const response = await fetch(`http://localhost:3000/api/products/${itemToChangeId}`);
    return item = await response.json();
}

async function countTotalItemsInCart() {
    let itemsQuantities = [];
    allQuantityInputs.forEach(element => {
        return itemsQuantities.push(parseInt(element.value));
    });   
    totalItemsInCart = itemsQuantities.reduce((partialSum, a) => partialSum + a, 0);
    showTotalOnPage();
    return totalItemsInCart;
}

async function countTotalPriceInCart() {
    let itemsPrices = [];
    allQuantityInputs.forEach(element => {
        let input = element;
        let itemId = input.closest("article").getAttribute("data-id");
        itemObject = {};
        for (item in localStorage) {
            if (localStorage.getItem(item)) {
                let itemObjectJSON = localStorage.getItem(item);
                itemObject = JSON.parse(itemObjectJSON);
            }
        };
        if (itemObject[0].id === itemId) {
            itemObject[0].quantity = parseInt(input.value);
            itemsPrices.push(itemObject[0].price * itemObject[0].quantity)
        }
    });   
    totalPriceInCart = itemsPrices.reduce((partialSum, a) => partialSum + a, 0);
    showTotalOnPage();
    return totalPriceInCart;
}

async function deleteItemInCart() {
    console.log(allQuantityInputs);
    allQuantityInputs.forEach(element => {
        let input = element;
        let itemId = input.closest("article").getAttribute("data-id");
        itemObject = {};
        for (item in localStorage) {
            if (localStorage.getItem(item)) {
                let itemObjectJSON = localStorage.getItem(item);
                itemObject = JSON.parse(itemObjectJSON);
                localStorage.removeItem(item)
            }
            if (itemObject[0].id === itemId) {
                localStorage.removeItem(item)
            }
        };
        
    });   
    console.log(localStorage);

    // showTotalOnPage();
}

async function modifyItemQuantity() {
    allQuantityInputs.forEach(element => {
        let itemQuantityValue = element.value;
        countTotalItemsInCart();
        countTotalPriceInCart();
        deleteItemInCart();
        itemToChange = element.closest("article.cart__item");
        itemToChangeId = itemToChange.getAttribute("data-id");
        item = fetchItemToChange();
        // itemObject = item.result;
        // console.log(itemObject);
        // item.quantity = itemQuantityValue;
        // console.log("the item's quantity is " + item.quantity);
        // console.log(localStorage);

    });   
//    for(item in cartItemsList) {
        
//    }
} 

async function showTotalOnPage() {
    totalQuantityHtml = document.getElementById("totalQuantity");
    totalPriceHtml = document.getElementById("totalPrice");
    totalQuantityHtml.innerHTML = totalItemsInCart;
    totalPriceHtml.innerHTML = totalPriceInCart;
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