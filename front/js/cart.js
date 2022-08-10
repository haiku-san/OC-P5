let cartItemsList = document.getElementById("cart__items");
let totalItemsInCart = 0;

console.log(localStorage);

document.title = "Votre panier";


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
    console.log(allQuantityInputs)
    allQuantityInputs.forEach(element => {
        element.addEventListener("change", modifyItemQuantity, false);
    });
    allQuantityDeleteButtons = document.querySelectorAll("p.deleteItem");
    allQuantityDeleteButtons.forEach(element => {
        element.addEventListener("click", deleteItemInCart, false);
    });
    countTotalItemsInCart();
    countTotalPriceInCart();
    formInputs = document.querySelectorAll("form input")
    formInputs.forEach(element => {
        element.addEventListener("input", validateForm, false);
    });
    submitFormButton = document.getElementById("order")
    submitFormButton.addEventListener("click", sendForm, false)
}

async function fetchItemToChange() {
    const response = await fetch(`http://localhost:3000/api/products/${itemToChangeId}`);
    return item = await response.json();
}

async function countTotalItemsInCart() {
    let itemsQuantities = [];
    allCartItems = document.querySelectorAll("article.cart__item");
    console.log(allCartItems)
    if(allCartItems.length === 0) {
        totalItemsInCart = 0
    } else {

    allCartItems.forEach(element => {
        itemQuantity = element.querySelector("input").value
        console.log(itemQuantity)
        return itemsQuantities.push(parseInt(itemQuantity));
    });   
    totalItemsInCart = itemsQuantities.reduce((partialSum, a) => partialSum + a, 0);
    }
    console.log(`Total items in cart is ${totalItemsInCart}`)
    showTotalOnPage();
    

    // return totalItemsInCart;
    
}

async function countTotalPriceInCart() {
    let itemsPrices = [];
    allCartItems = document.querySelectorAll("article.cart__item");
    if(allCartItems.length === 0) {
        totalPriceInCart = 0
    } else {
    allCartItems.forEach(element => {
        let input = element.querySelector("input");
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
    }
    console.log(`Total price in cart is ${totalPriceInCart}`)

    showTotalOnPage();
    // return totalPriceInCart;
}

async function deleteItemInCart(e) {
    let deleteButton = e.target;
    console.log(deleteButton);
    // let itemName = deleteButton.closest("article h2");
    let itemArticle = deleteButton.closest("article");
    let itemColor = itemArticle.getAttribute("data-color");
    let itemId = itemArticle.getAttribute("data-id");
    // console.log(itemName);
    itemObject = {};
    for (item in localStorage) {
        if (localStorage.getItem(item)) {
            let itemObjectJSON = localStorage.getItem(item);
            itemObject = JSON.parse(itemObjectJSON);
        }
        if (itemObject[0].id === itemId && itemObject[0].color === itemColor) {
            console.log(itemId);
            console.log(itemObject);
            console.log(itemObject[0].id);
            localStorage.removeItem(item)
            itemArticle.remove()
            
        }
        console.log("fin de la boucle for de la fonction deleteItemInCart")
    };   
    console.log('On lance les fonctions des totaux')
    countTotalItemsInCart();
    countTotalPriceInCart();
    showTotalOnPage()
    console.log(totalItemsInCart)
    console.log(totalPriceInCart)
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

function validateForm(input) {
    let inputInFocus = input.target
    let inputValue = inputInFocus.value
    // let firstNameHTML = document.getElementById("firstName")
    // let firstName = firstNameHTML.value
    // let lastNameHTML = document.getElementById("lastName")
    // let lastName = lastNameHTML.value
    // let addressHTML = document.getElementById("address")
    // let address = addressHTML.value
    // let cityHTML = document.getElementById("city")
    // let city = cityHTML.value
    // let emailHTML = document.getElementById("email")
    // let email = emailHTML.value
    // console.log(firstName)
    // console.log(lastName)
    // console.log(address)
    // console.log(city)
    // console.log(email)
    let nameRGEX = /[^A-zÀ-ú-]/
    let addressRGEX = /[^A-zÀ-ú0-9- ]/
    // let emailRGEX = /(\w\.?)+@[\w\.-]+\.\w{2,}/
    // let emailRGEX = /(\w\.?)+@[\w\.-]+\.\w{2,}/
    let emailRGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
    // if(!inputValue.match(nameRGEX) && inputInFocus.name == "firstName") {
    //     console.log("first name is false")
    //     inputInFocus.style.backgroundColor = "red"
    // }
    // if(!inputValue.match(nameRGEX) && inputInFocus.name == "lastName") {
    //     console.log("last name is false")
    //     inputInFocus.style.backgroundColor = "red"
    // }
    // if(!inputValue.match(addressRGEX) && inputInFocus.name == "address") {
    //     console.log("address is false")
    //     inputInFocus.style.backgroundColor = "red"
    // }
    // if(!inputValue.match(nameRGEX) && inputInFocus.name == "city") {
    //     console.log("city is false")
    //     inputInFocus.style.backgroundColor = "red"
    // }
    // if(!inputValue.match(emailRGEX) && inputInFocus.name == "email") {
    //     console.log("email is false")
    //     inputInFocus.style.backgroundColor = "red"
    // }
    let firstNameAlert = document.getElementById("firstNameAlert")
    let lastNameAlert = document.getElementById("lastNameAlert")
    let addressAlert = document.getElementById("addressAlert")
    let cityAlert = document.getElementById("cityAlert")
    let emailAlert = document.getElementById("emailAlert")

    if(nameRGEX.test(inputValue) && inputInFocus.name == "firstName") {
        console.log("first name is false")
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!firstNameAlert) {
            let alertMessage = document.createElement("p.firstNameAlert")
            alertMessage.setAttribute("id", "firstNameAlert")
            alertMessage.innerHTML = "Veuillez saisir un prénom valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
        }
       
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "firstName") {
        console.log("first name is true")
        inputInFocus.style.backgroundColor = "white"
        if(firstNameAlert) {
            firstNameAlert.remove()
        }
    }
    if(nameRGEX.test(inputValue) && inputInFocus.name == "lastName") {
        console.log("last name is false")
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!lastNameAlert) {
            let alertMessage = document.createElement("p.lastNameAlert")
            alertMessage.setAttribute("id", "lastNameAlert")
            alertMessage.innerHTML = "Veuillez saisir un nom de famille valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
        }
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "lastName") {
        console.log("last name is true")
        inputInFocus.style.backgroundColor = "white"
        if(lastNameAlert) {
            lastNameAlert.remove()
        }
    }
    if(addressRGEX.test(inputValue) && inputInFocus.name == "address") {
        console.log("address is false")
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!addressAlert) {
            let alertMessage = document.createElement("p.addressAlert")
            alertMessage.setAttribute("id", "addressAlert")
            alertMessage.innerHTML = "Veuillez saisir une adresse valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
        }
    } else if (!addressRGEX.test(inputValue) && inputInFocus.name == "address") {
        console.log("address is true")
        inputInFocus.style.backgroundColor = "white"
        if(addressAlert) {
            addressAlert.remove()
        }
    }
    if(nameRGEX.test(inputValue) && inputInFocus.name == "city") {
        console.log("city is false")
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!cityAlert) {
            let alertMessage = document.createElement("p.cityAlert")
            alertMessage.setAttribute("id", "cityAlert")
            alertMessage.innerHTML = "Veuillez saisir une ville existante"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
        }
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "city") {
        console.log("city is true")
        inputInFocus.style.backgroundColor = "white"
        if(cityAlert) {
            cityAlert.remove()
        }
    }
    if(!emailRGEX.test(inputValue) && inputInFocus.name == "email") {
        console.log("email is false")
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!emailAlert) {
            let alertMessage = document.createElement("p.emailAlert")
            alertMessage.setAttribute("id", "emailAlert")
            alertMessage.innerHTML = "Veuillez saisir un email valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
        }
    } else if (emailRGEX.test(inputValue) && inputInFocus.name == "email") {
        console.log("email is true")
        inputInFocus.style.backgroundColor = "white"
        if(emailAlert) {
            emailAlert.remove()
        }
    }
    
}

function createProductsList() {
    allCartItems = document.querySelectorAll("article.cart__item")
    allProductsList = []
    allCartItems.forEach(element => {
        currentItemId = element.getAttribute("data-id")
        allProductsList.push(currentItemId)
    })
    return allProductsList
}

async function fetchOrder() {
    firstName = document.querySelector("input[id=firstName]").value
    lastName = document.querySelector("input[id=lastName]").value
    address = document.querySelector("input[id=address]").value
    city = document.querySelector("input[id=city]").value
    email = document.querySelector("input[id=email]").value

    

    console.log(firstName)
    console.log(lastName)
    console.log(address)
    console.log(city)
    console.log(email)

    let data = {
        contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
        },
        products: allProductsList
    }

    console.log(data)

    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    }
    const response = await fetch(`http://localhost:3000/api/products/order`, options);
    await console.log(allProductsList)
    await console.log(response)
    
    return await response.json();
}

async function sendForm(e) {
    e.preventDefault()
    console.log("Youpi vous avez appuyé sur le bouton !")
    // console.log(allAlerts)

    

    createProductsList()
    console.log(allProductsList)

    let orderRequestRes = await fetchOrder().then(res => {
        console.log(res)

        return res
    }).then(res => {
        orderId = res.orderId
        console.log(orderId)
        
    }).catch(err => {
        console.log(err)
    })


}


// form.addEventListener("submit", function(e) {e.preventDefault()})



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