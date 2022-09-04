let cartItemsList = document.getElementById("cart__items");
let totalItemsInCart = 0;
let totalPriceInCart = 0;
let cartPriceHTML = ""

let formIsValid = true

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
    }
}

window.onload = function() {
    cartPriceHTML = document.querySelector("div.cart__price")
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
    submitFormButton.addEventListener("click", e => {sendForm(e)}, false)
}

async function fetchItemToChange() {
    const response = await fetch(`http://localhost:3000/api/products/${itemToChangeId}`);
    return item = await response.json();
}

function countTotalItemsInCart() {
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
    
    
    
}

/// Changer la fonction pour requeter le prix depuis l'API et non pas depuis le localstorage

function countTotalPriceInCart() {
    let itemsPrices = [];
    allCartItems = document.querySelectorAll("article.cart__item");
    console.log(allCartItems)
    if(allCartItems.length === 0) {
        totalPriceInCart = 0
    } else {
        allCartItems.forEach(element => {
            console.log(element)
            let input = element.querySelector("input");
            console.log(input)
            let itemId = input.closest("article").getAttribute("data-id");
            console.log(itemId)
            itemObjects = [];
            for (item in localStorage) {
                if (localStorage.getItem(item)) {
                    let itemObjectJSON = localStorage.getItem(item);
                    itemObjects.push(JSON.parse(itemObjectJSON))
                }
                
            }
            console.log(itemObjects)

            let itemsList = []

            retrieveItems().then(res => {
                itemObjects.forEach(itemObject => {
                    if (itemObject[0].id === itemId) {
                        let itemPrice = 0
                        console.log(itemObject)
                        itemObject[0].quantity = parseInt(input.value);
                        console.log(parseInt(input.value))
                        res.forEach(item => {
                            if (itemObject[0].id === item._id) {
                                itemPrice = item.price
                                console.log(itemPrice)
                                itemsPrices.push(Number(itemPrice) * itemObject[0].quantity)

                            }
                        })
                    }
                })

                console.log("itemsPrices are")
                console.log(itemsPrices)
                console.log("TEST")
                console.log(itemsPrices[0])
                itemsPrices.forEach(price => {
                    console.log("on rentre dans le forEach")
                    console.log(price)
                    console.log(typeof(price))
                })
                totalPriceInCart = itemsPrices.reduce((partialSum, a) => partialSum + a, 0);
                console.log(`Total price in cart is ${totalPriceInCart}`)
    
                showTotalOnPage();

            })
            
        });   
    }
}

async function retrieveItems() {
    const response = await fetch('http://localhost:3000/api/products/');
    console.log(response);
    itemsList = await response.json();

    

    
    
    return itemsList
}

function deleteItemInCart(e) {
    let deleteButton = e.target;
    console.log(deleteButton);
    let itemArticle = deleteButton.closest("article");
    let itemColor = itemArticle.getAttribute("data-color");
    let itemId = itemArticle.getAttribute("data-id");
    itemObject = {};
    if(confirm("Voulez-vous vraiment supprimer cet article de votre panier ?") == true) {
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
        alert("Le produit a bien été supprimé de votre panier")
    } else {
        alert("Le produit n'a pas été supprimé de votre panier")
    }
    
    console.log('On lance les fonctions des totaux')
    countTotalItemsInCart();
    countTotalPriceInCart();
    showTotalOnPage()
    console.log(totalItemsInCart)
    console.log(totalPriceInCart)
    console.log(localStorage);
    
    
}

function modifyItemQuantity() {
    allQuantityInputs.forEach(element => {
        let itemQuantityValue = element.value;
        countTotalItemsInCart();
        countTotalPriceInCart();
        itemToChange = element.closest("article.cart__item");
        itemToChangeId = itemToChange.getAttribute("data-id");
        item = fetchItemToChange();
    });   
} 

function showTotalOnPage() {
    console.log(cartPriceHTML)
    if(totalItemsInCart < 2) {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> article) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    } else {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> articles) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    }
    
}

function validateForm(input) {
    console.log(formIsValid)
    let inputInFocus = input.target || input
    console.log(inputInFocus)
    let inputValue = inputInFocus.value
    let nameRGEX = /[^A-zÀ-ú-]/
    let addressRGEX = /[^A-zÀ-ú0-9- ]/
    let emailRGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let firstNameAlert = document.getElementById("firstNameAlert")
    let lastNameAlert = document.getElementById("lastNameAlert")
    let addressAlert = document.getElementById("addressAlert")
    let cityAlert = document.getElementById("cityAlert")
    let emailAlert = document.getElementById("emailAlert")
    
    if(inputInFocus.value == "") {
        console.log("On vérifie si les inputs sont vides")
        formIsValid = false
    }
    console.log(inputValue)
    
    if(nameRGEX.test(inputValue) && inputInFocus.name == "firstName") {
        console.log("first name is false")
        formIsValid = false
        console.log("is first name valid?")
        console.log(formIsValid)
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
        formIsValid = false
        console.log("is last name valid?")
        console.log(formIsValid)
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
        formIsValid = false
        console.log("is address valid?")
        console.log(formIsValid)
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
        formIsValid = false
        console.log("is city valid?")
        console.log(formIsValid)
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
        formIsValid = false
        console.log("is email valid?")
        console.log(formIsValid)
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
    
    console.log(formIsValid)
    
    
    
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
    console.log(allProductsList)
    console.log(response)
    
    return await response.json();
}



async function sendForm(e) {
    e.preventDefault()
    console.log("Youpi vous avez appuyé sur le bouton !")
    createProductsList()
    console.log(allProductsList)
    formIsValid = true
    formInputs.forEach(element => {
        validateForm(element)
    });    
    console.log(formIsValid)
    if(formIsValid == true) {
        if(confirm("Voulez-vous vraiment procéder à la commande ?") == true) {
            await fetchOrder().then(res => {
                console.log(res)
                return res
            }).then(res => {
                orderId = res.orderId
                console.log(orderId)
                alert("Votre commande a été validée")
                window.location.assign(`./confirmation.html?orderId=${orderId}`)
                
            }).catch(err => {
                console.log(err)
            })
        } else {
            alert("La commande n'a pas été passée")
        }
        
        
    } else {
        alert("Veuillez corriger le formulaire svp")
    }
    
    
    
}