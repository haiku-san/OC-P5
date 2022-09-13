let itemHtml = document.querySelector("section.item");

let url = new URL(window.location.href)
let id = url.searchParams.get("id");




retrieveItems().catch(function(err) {
    console.log(err)
});


// Récupère le produit à afficher depuis l'API
async function retrieveItems() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    const item = await response.json();

  

    let productPage = document.createElement("article");
    productPage.innerHTML = `<div class="item__img"><img src=${item.imageUrl} alt=${item.altTxt}></div><div class="item__content"><div class="item__content__titlePrice"><h1 id="title">${item.name}</h1><p>Prix : <span id="price">${item.price}</span>€</p></div><div class="item__content__description"><p class="item__content__description__title">Description :</p><p id="description">${item.description}</p></div><div class="item__content__settings"><div class="item__content__settings__color"><label for="color-select">Choisir une couleur :</label><select name="color-select" id="colors"><option value="">--SVP, choisissez une couleur --</option></option></select></div><div class="item__content__settings__quantity"><label for="itemQuantity">Nombre d'article(s) (1-100) :</label><input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity"></div></div><div class="item__content__addButton"><button id="addToCart">Ajouter au panier</button></div></div>`;
    itemHtml.appendChild(productPage);
    document.title = item.name;

    item.colors.forEach(function(color) {
        let colorsList = document.getElementById("colors");
        colorsList.insertAdjacentHTML("beforeend", `<option value="${color}">${color}</option>`);
    })


      

    // Ajoute le produit dans le localStorage
    function addToCart() {
        console.log("vous venez d'appuyer sur le bouton");
        let colorsList = document.getElementById("colors");

        let quantity = document.getElementById('quantity');
        let productName = `${item.name} `+`${colorsList.value}`;
        let productsList = [];
        let newItemJSON = {
            name: item.name,
            id: item._id,
            color: colorsList.value,
            quantity: quantity.value,
            imageUrl: item.imageUrl,
            altTxt: item.altTxt,
            price: item.price
        };

        let newProductQuantity = newItemJSON.quantity;


        if(localStorage.getItem(productName)) {
            if(confirm("Voulez-vous ajouter ce produit au panier ?") == true) {
                let currentProduct = JSON.parse(localStorage.getItem(productName));
                let currentProductQuantity = currentProduct[0].quantity;
                let finalProductQuantity = parseInt(currentProductQuantity) + parseInt(newProductQuantity);
                newItemJSON = {
                    name: item.name,
                    id: item._id,
                    color: colorsList.value,
                    quantity: finalProductQuantity,
                    imageUrl: item.imageUrl,
                    altTxt: item.altTxt,
                    price: item.price
                };
                productsList.push(newItemJSON);
                newItemString = JSON.stringify(productsList);
                localStorage.setItem(productName, newItemString);
                alert("Le produit a bien été ajouté au panier")
            } else {
                alert("Le produit n'a pas été ajouté au panier")
            }

        } else if(colorsList.value === "") {
            window.alert("Veuillez sélectionner une couleur")
        } else if(parseInt(quantity.value) === 0) {
            window.alert("Veuillez sélectionner une quantité valable")
        } else {
            if(confirm("Voulez-vous ajouter ce produit au panier ?") == true) {
                productsList.push(newItemJSON);
                newItemString = JSON.stringify(productsList);
                localStorage.setItem(productName, newItemString);
                alert("Le produit a bien été ajouté au panier")
            } else {
                alert("Le produit n'a pas été ajouté au panier")
            }
           
        } 
        


       
        
        
    }

    window.onload = function() {
        let addToCartButton = document.getElementById("addToCart");
        
        addToCartButton.addEventListener("click", addToCart, false);
        }


};


