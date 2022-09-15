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


    let imgHtml = document.querySelector("div.item__img img")
    imgHtml.setAttribute("src", item.imageUrl)
    imgHtml.setAttribute("alt", item.altTxt)

    let titleHtml = document.getElementById("title")
    titleHtml.innerHTML = item.name

    let priceHtml = document.getElementById("price")
    priceHtml.innerHTML = item.price

    let descriptionHtml = document.getElementById("description")
    descriptionHtml.innerHTML = item.description

    document.title = item.name;

    let initialColorsHtml = document.querySelectorAll("option")
    initialColorsHtml.forEach(color => {
        if(color.value == "vert" || color.value == "blanc") {
            color.remove()

        }
    })

    item.colors.forEach(function(color) {
        let colorsList = document.getElementById("colors");
        colorsList.insertAdjacentHTML("beforeend", `<option value="${color}">${color}</option>`);
    })


      

    // Ajoute le produit dans le localStorage
    function addToCart() {
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
        } else if(parseInt(quantity.value) == 0 || parseInt(quantity.value) > 100) {
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


