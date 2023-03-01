// On déclare des variables que l'on va utiliser dans tout le fichier
let cartItemsList = document.getElementById("cart__items");
let totalItemsInCart = 0;
let totalPriceInCart = 0;
let cartPriceHTML = ""

// On récupère les articles dans le panier du localstorage, puis on les parse en utilisant JSON.parse
let allItemsInCart = localStorage.getItem("cart")
let allItemsInCartParsed = JSON.parse(allItemsInCart)

// On crée un boolean pour vérifier si le formulaire est correctement rempli ou non
let formIsValid = true

// On change le titre de la page html à travers le DOM
document.title = "Votre panier";



showInCart().catch(function(err) {
    console.log(err)
});


// * On affiche les produits sur la page panier

// On récupère la liste de tous les articles dans le panier
// Si l'article existe alors on récupère ses données dans l'API puis on crée la card en utilisant le literal templating
// Ensuite on prend chaque input pour modifier la quantité et chaque bouton supprimer des cards et on y crée des event listeners
// qui lancent les fonctions deleteItemInCart() et modifyItemQuantity() lorsqu'ils sont activés
async function showInCart() {

    for(item in allItemsInCartParsed) {
        productInCart = allItemsInCartParsed[item];        

        if(productInCart) {
            itemToFetch = productInCart.id
            let productInServer = await fetchASingleItem()
            productInCart.price = productInServer.price
            let newItemCard = document.createElement("article");
            newItemCard.setAttribute("class", "cart__item");
            newItemCard.setAttribute("data-id", `${productInCart.id}`);
            newItemCard.setAttribute("data-color", `${productInCart.color}`);
            newItemCard.innerHTML = 
            `<div class="cart__item__img"> 
                <img src="${productInCart.imageUrl}" alt="${productInCart.altTxt}"> 
            </div> 
            <div class="cart__item__content"> 
                <div class="cart__item__content__description"> 
                    <h2>${productInCart.name}</h2> 
                    <p>${productInCart.color}</p> 
                    <p>${productInCart.price.toFixed(2)} €</p> 
                </div> 
                <div class="cart__item__content__settings"> 
                    <div class="cart__item__content__settings__quantity"> 
                        <p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}" > 
                    </div> 
                    <div class="cart__item__content__settings__delete"> 
                        <p class="deleteItem">Supprimer</p> 
                    </div> 
                </div> 
            </div>`;
            cartItemsList.appendChild(newItemCard);
            
            
            
        }
    }
    allQuantityDeleteButtons = document.querySelectorAll("p.deleteItem");
    allQuantityDeleteButtons.forEach(element => {
        element.addEventListener("click", deleteItemInCart, false);
    });
    
    allQuantityInputs = document.querySelectorAll("input.itemQuantity");
    allQuantityInputs.forEach(element => {
        element.addEventListener("change", modifyItemQuantity, false);
    });
}



// * On récupère les infos d'un article depuis l'API en utilisant fetch
async function fetchASingleItem() {
    const response = await fetch(`http://localhost:3000/api/products/${itemToFetch}`);
    return item = await response.json();
}


// * Compte le nombre d'articles dans le panier

// on crée un array vide et un autre array contenant tous les items du tableau d'article
// Si l'array contenant les articles est vide alors le nombre d'articles est égal à 0
// Si l'array n'est pas vide alors on boucle et pour chaque article on récupère la valeur de l'input de quantité

// On rajoute ces valeurs dans une liste qe l'on réduit pour obtenir la somme de toutes les quantités
// A la fin on lance la fonction showTotalOnPage() pour mettre à jour le code HTML
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

// * Compte le prix total du panier

// On commence par créer un array vide qui va contenir les prix de chaque article
// On crée un autre array contenant tous les items du tableau d'article
// Si cet array est vide, alors le prix est égal à 0
// Sinon, on récupère la liste de tous les articles depuis l'API 
// et on boucle au sein de cette liste afin de retrouver le prix des items que l'on a dans le panier

// Pour chaque item du panier, on récupère son prix depuis l'API et on le mutlpilie par la quantité de l'objet dans le panier
// On additionne toutes les valeurs avec la methode array.reduce() puis on lance la fonction showTotalOnPage()
// pour modifier le contenu HTML
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
            for (item in allItemsInCartParsed) {
                if (allItemsInCartParsed[item]) {
                    let itemObjectJSON = allItemsInCartParsed[item];
                    itemObjects.push(itemObjectJSON)
                }
                
            }
            
            itemObjects.forEach(itemObject => {
                if (itemObject.id === itemId) {
                    let itemPrice = 0
                    itemObject.quantity = parseInt(input.value);
                    itemToFetch = itemObject.id
               
                 res.forEach(item => {
                        if (itemObject.id === item._id) {
                            itemPrice = item.price
                            itemsPrices.push(Number(itemPrice) * itemObject.quantity)
                     }
                    })
                }
            })
            totalPriceInCart = itemsPrices.reduce((partialSum, a) => partialSum + a, 0);
            showTotalOnPage();


            
        });   
    }
}

// * Récupère la liste des produits depuis l'API
async function retrieveItems() {
    const response = await fetch('http://localhost:3000/api/products/');
    itemsList = await response.json();

    
    return itemsList
}

// * Permet la suppression d'un article du panier lorsque l'on clique sur le bouton "supprimer"
// @param e : le bouton "supprimer" 

// Grâce à la position du bouton "supprimer" qui a été enclenché par l'utilisateur
// on récupère le contenu HTML de l'article, sa couleur et son id

// On demande à l'utilisateur de confirmer son souhait de supprimer un article
// S'il répond oui alors on boucle au sein du panier et pour chaque article on cherche celui dont l'id et la couleur
// correspondent à l'article que l'utilisateur souhaite supprimer

// Une fois que l'on tombe sur cet article, alors on récupère les données du panier actuel que l'on parse
// On supprime l'article de la liste puis on remet le nouveau panier dans le localstorage

// Pour finir on supprime le code HTML de l'article et on lance les fonctions permettant de recalucler et d'afficher les totaux
function deleteItemInCart(e) {
    let deleteButton = e.target;
    let itemArticle = deleteButton.closest("article");
    let itemColor = itemArticle.getAttribute("data-color");
    let itemId = itemArticle.getAttribute("data-id");
    itemObject = {};
    if(confirm("Voulez-vous vraiment supprimer cet article de votre panier ?") == true) {
        for (item in allItemsInCartParsed) {
            let itemObject = allItemsInCartParsed[item];
            if (itemObject.id === itemId && itemObject.color === itemColor) {
                let currentCartJSON = localStorage.getItem("cart")
                currentCart = JSON.parse(currentCartJSON)
                delete currentCart[item]
                currentCartJSON = JSON.stringify(currentCart)
                localStorage.removeItem("cart")
                localStorage.setItem("cart", currentCartJSON)
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

// * Permet la modification de la quantité d'un article directement depuis la page panier
function modifyItemQuantity() {
    // allQuantityInputs.forEach(element => {
    countTotalItemsInCart();
    countTotalPriceInCart();

    // });   
} 

// * Affiche les totaux sur la page panier
function showTotalOnPage() {
    if(totalItemsInCart < 2) {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> article) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    } else {
        cartPriceHTML.innerHTML = `<p>Total (<span id='totalQuantity'>${totalItemsInCart}</span> articles) : <span id='totalPrice'>${totalPriceInCart}</span> €</p>`
    }
    
}

// * Vérifie en temps réel si les informations saisies par l'utilisateur dans le formulaire sont erronnées
// Permet de s'assurer que les informations envoyées au serveur correspondent aux informations attendues
// @param input : l'entrée de formulaire qui est focus par l'utilisateur

// On utilise des expressions régulières pour vérifier si les données insérées par l'utilisateur 
// correspondent au formatage attendu
// On crée des expressions régulières pour chaque type de données :
// - le nom
// - l'adresse postale
// - l'adresse mail

// Pour l'input de formulaire actuellement en focus, on vérifie sa valeur
// Si elle est nulle, alors on n'affiche rien
// Si elle correspond au formatage attendu, on n'affiche rien non plus
// Si elle ne correspond pas au formatage attendu, alors on affiche un fond rouge et un message d'erreur sous l'input

// Pour conditionner l'envoi du formulaire au formatage des informations, on utilise un boolean "formIsValid"
// qui devient true uniquement lorsque toutes les entrées du formulaire sont correctement renseignées.
// Sinon il reste sur false et l'envoi du formulaire est impossible
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


// * Crée la liste d'ID des produits dans le panier
// Pour chaque article on récupère son ID et on le push dans une liste
function createProductsList() {
    allCartItems = document.querySelectorAll("article.cart__item")
    allProductsList = []
    allCartItems.forEach(element => {
        currentItemId = element.getAttribute("data-id")
        allProductsList.push(currentItemId)
    })
    return allProductsList
}

// * Envoi la requête au serveur lors de la validation du panier

// On commence par créer un objet data que l'on formate selon les attentes de l'API
// Puis on précise les headers de notre requête
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


// * Permet de valider l'envoi du formulaire si celui-ci est valide
// Sinon, prévient l'utilisateur que le formulaire doit être corrigé
// @param e : bouton "envoyer" du formulaire

// On commence par empêcher le comportement par défaut du bouton "envoyer"
// On lance la fonction createProductsList() pour récupérer la liste des produits du panier

// On boucle dans la liste de tous les inputs du formulaire et pour chaque input on vérifie si celui-ci est correctement rempli
// Sinon, on demande à l'utilisateur de le corriger

// Si le formulaire est correctement rempli, on demande à l'utilisateur de confirmer la commande 
// puis on lance la fonction "fetchOrder"

// On récupère l'id de la commande et on l'insère en paramètre de l'url pour ouvrir la page de confirmation
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

window.onload = function() {
    cartPriceHTML = document.querySelector("div.cart__price");
    
    countTotalItemsInCart();
    countTotalPriceInCart();
    formInputs = document.querySelectorAll("form input")
    formInputs.forEach(element => {
        element.addEventListener("input", validateForm, false);
    });
    submitFormButton = document.getElementById("order")
    submitFormButton.addEventListener("click", e => {sendForm(e)}, false)
}