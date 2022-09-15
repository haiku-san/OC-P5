let cartItemsList = document.getElementById("cart__items");
let totalItemsInCart = 0;
let totalPriceInCart = 0;
let cartPriceHTML = ""

// On crée un boolean pour vérifier si le formulaire est correctement rempli ou non
let formIsValid = true


document.title = "Votre panier";

window.onload = function() {
    cartPriceHTML = document.querySelector("div.cart__price");
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

showInCart().catch(function(err) {
    console.log(err)
});


// On affiche les produits sur la page panier
async function showInCart() {
    for(item in localStorage) {
        productInCart = JSON.parse(localStorage.getItem(item));
        

        if(productInCart) {
            itemToFetch = productInCart[0].id
            let productInServer = await fetchASingleItem()
            productInCart[0].price = productInServer.price
            let newItemCard = document.createElement("article");
            newItemCard.setAttribute("class", "cart__item");
            newItemCard.setAttribute("data-id", `${productInCart[0].id}`);
            newItemCard.setAttribute("data-color", `${productInCart[0].color}`);
            newItemCard.innerHTML = `<div class="cart__item__img"> <img src="${productInCart[0].imageUrl}" alt="${productInCart[0].altTxt}"> </div> <div class="cart__item__content"> <div class="cart__item__content__description"> <h2>${productInCart[0].name}</h2> <p>${productInCart[0].color}</p> <p>${productInCart[0].price.toFixed(2)} €</p> </div> <div class="cart__item__content__settings"> <div class="cart__item__content__settings__quantity"> <p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart[0].quantity}" > </div> <div class="cart__item__content__settings__delete"> <p class="deleteItem">Supprimer</p> </div> </div> </div>`;
            cartItemsList.appendChild(newItemCard);
            
            
            
        }
    }

    allQuantityInputs = document.querySelectorAll("input.itemQuantity");
    allQuantityInputs.forEach(element => {
        element.addEventListener("change", modifyItemQuantity, false);
    });
}




async function fetchASingleItem() {
    const response = await fetch(`http://localhost:3000/api/products/${itemToFetch}`);
    return item = await response.json();
}


// Compte le nombre d'articles dans le panier
function countTotalItemsInCart() {
    let itemsQuantities = [];
    allCartItems = document.querySelectorAll("article.cart__item");
    if(allCartItems.length === 0) {
        totalItemsInCart = 0
    } else {
        
        allCartItems.forEach(element => {
            itemQuantity = element.querySelector("input").value
            return itemsQuantities.push(parseInt(itemQuantity));
        });   
        totalItemsInCart = itemsQuantities.reduce((partialSum, a) => partialSum + a, 0);
    }
    showTotalOnPage();
    
    
    
}

// Compte le prix total du panier
async function countTotalPriceInCart() {

    let itemsPrices = [];
    allCartItems = document.querySelectorAll("article.cart__item");
    if(allCartItems.length === 0) {
        totalPriceInCart = 0
    } else {
        let res = await retrieveItems()
        allCartItems.forEach(element => {
            let input = element.querySelector("input");
            let itemId = input.closest("article").getAttribute("data-id");
            itemObjects = [];
            for (item in localStorage) {
                if (localStorage.getItem(item)) {
                    let itemObjectJSON = localStorage.getItem(item);
                    itemObjects.push(JSON.parse(itemObjectJSON))
                }
                
            }
            
            itemObjects.forEach(itemObject => {
                if (itemObject[0].id === itemId) {
                    let itemPrice = 0
                    itemObject[0].quantity = parseInt(input.value);
                    itemToFetch = itemObject[0].id
               
                 res.forEach(item => {
                        if (itemObject[0].id === item._id) {
                            itemPrice = item.price
                            itemsPrices.push(Number(itemPrice) * itemObject[0].quantity)
                     }
                    })
                }
            })
            totalPriceInCart = itemsPrices.reduce((partialSum, a) => partialSum + a, 0);
            showTotalOnPage();


            
        });   
    }
}

// Récupère la liste des produits depuis l'API
async function retrieveItems() {
    const response = await fetch('http://localhost:3000/api/products/');
    itemsList = await response.json();

    
    return itemsList
}

// Permet la suppression d'un article du panier lorsque l'on clique sur le bouton "supprimer"
// @param e : le bouton "supprimer" 
function deleteItemInCart(e) {
    let deleteButton = e.target;
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
                localStorage.removeItem(item)
                itemArticle.remove()
                
                
            }
        };   
        alert("Le produit a bien été supprimé de votre panier")
    } else {
        alert("Le produit n'a pas été supprimé de votre panier")
    }
    
    countTotalItemsInCart();
    countTotalPriceInCart();
    showTotalOnPage()
    
    
}

// Permet la modification de la quantité d'un article directement depuis la page panier
function modifyItemQuantity() {
    // allQuantityInputs.forEach(element => {
    countTotalItemsInCart();
    countTotalPriceInCart();

    // });   
} 

// Affiche les totaux sur la page panier
function showTotalOnPage() {
    if(totalItemsInCart < 2) {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> article) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    } else {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> articles) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    }
    
}

// Vérifie en temps réel si les informations saisies par l'utilisateur dans le formulaire sont erronnées
// Permet de s'assurer que les informations envoyées au serveur correspondent aux informations attendues
function validateForm(input) {
    let inputInFocus = input.target || input
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
        formIsValid = false
    }
    
    if(inputInFocus.value !== "" && nameRGEX.test(inputValue) && inputInFocus.name == "firstName") {
        formIsValid = false
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!firstNameAlert) {
            let alertMessage = document.createElement("p.firstNameAlert")
            alertMessage.setAttribute("id", "firstNameAlert")
            alertMessage.innerHTML = "Veuillez saisir un prénom valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
            
            
        }
        
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "firstName") {
        inputInFocus.style.backgroundColor = "white"
        if(firstNameAlert) {
            firstNameAlert.remove()
            
        }
    }
    if(inputInFocus.value !== "" && nameRGEX.test(inputValue) && inputInFocus.name == "lastName") {
        formIsValid = false
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!lastNameAlert) {
            let alertMessage = document.createElement("p.lastNameAlert")
            alertMessage.setAttribute("id", "lastNameAlert")
            alertMessage.innerHTML = "Veuillez saisir un nom de famille valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
            
            
        }
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "lastName") {
        inputInFocus.style.backgroundColor = "white"
        if(lastNameAlert) {
            lastNameAlert.remove()
            
        }
    }
    if(inputInFocus.value !== "" && addressRGEX.test(inputValue) && inputInFocus.name == "address") {
        formIsValid = false
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!addressAlert) {
            let alertMessage = document.createElement("p.addressAlert")
            alertMessage.setAttribute("id", "addressAlert")
            alertMessage.innerHTML = "Veuillez saisir une adresse valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
            
            
        }
    } else if (!addressRGEX.test(inputValue) && inputInFocus.name == "address") {
        inputInFocus.style.backgroundColor = "white"
        if(addressAlert) {
            addressAlert.remove()
            
        }
    }
    if(inputInFocus.value !== "" && nameRGEX.test(inputValue) && inputInFocus.name == "city") {
        formIsValid = false
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!cityAlert) {
            let alertMessage = document.createElement("p.cityAlert")
            alertMessage.setAttribute("id", "cityAlert")
            alertMessage.innerHTML = "Veuillez saisir une ville existante"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
            
            
        }
    } else if (!nameRGEX.test(inputValue) && inputInFocus.name == "city") {
        inputInFocus.style.backgroundColor = "white"
        if(cityAlert) {
            cityAlert.remove()
            
        }
    }
    if(inputInFocus.value !== "" && !emailRGEX.test(inputValue) && inputInFocus.name == "email") {
        formIsValid = false
        inputInFocus.style.backgroundColor = "#FF8CA3"
        if(!emailAlert) {
            let alertMessage = document.createElement("p.emailAlert")
            alertMessage.setAttribute("id", "emailAlert")
            alertMessage.innerHTML = "Veuillez saisir un email valide"
            inputInFocus.insertAdjacentElement('afterend', alertMessage)
            
            
        }
    } else if (emailRGEX.test(inputValue) && inputInFocus.name == "email") {
        inputInFocus.style.backgroundColor = "white"
        if(emailAlert) {
            emailAlert.remove()
            
        }
    }
    
    
    
    
}


// Crée la liste d'ID des produits dans le panier
function createProductsList() {
    allCartItems = document.querySelectorAll("article.cart__item")
    allProductsList = []
    allCartItems.forEach(element => {
        currentItemId = element.getAttribute("data-id")
        allProductsList.push(currentItemId)
    })
    return allProductsList
}

// Envoi la requête au serveur lors de la validation du panier
async function fetchOrder() {
    firstName = document.querySelector("input[id=firstName]").value
    lastName = document.querySelector("input[id=lastName]").value
    address = document.querySelector("input[id=address]").value
    city = document.querySelector("input[id=city]").value
    email = document.querySelector("input[id=email]").value
    
    
    
    
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
    
    
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        
    }
    const response = await fetch(`http://localhost:3000/api/products/order`, options);
    
    return await response.json();
}


// Permet de valider l'envoi du formulaire si celui-ci est valide
// Sinon, prévient l'utilisateur que le formulaire doit être corrigé
async function sendForm(e) {
    e.preventDefault()
    createProductsList()
    formIsValid = true
    formInputs.forEach(element => {
        validateForm(element)
    });    
    if(formIsValid == true) {

        if(confirm("Voulez-vous vraiment procéder à la commande ?") == true) {
            let res = await fetchOrder()
            orderId = res.orderId
            alert("Votre commande a été validée")
            window.location.assign(`./confirmation.html?orderId=${orderId}`)
        } else {
            alert("La commande n'a pas été passée")
        }        
        
    } else {
        alert("Veuillez corriger le formulaire svp")
    }
    
    
    
}