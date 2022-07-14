let itemHtml = document.querySelector("section.item");
console.log(itemHtml);

let url = new URL(window.location.href)
let id = url.searchParams.get("id");
console.log(id);



retrieveItems().catch(function(err) {
    console.log(err)
});

async function retrieveItems() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    console.log(response);
    const item = await response.json();
    console.log(item);

  

    let productPage = document.createElement("article");
    productPage.innerHTML = `<div class="item__img"><img src=${item.imageUrl} alt=${item.altTxt}></div><div class="item__content"><div class="item__content__titlePrice"><h1 id="title">${item.name}</h1><p>Prix : <span id="price">${item.price}</span>€</p></div><div class="item__content__description"><p class="item__content__description__title">Description :</p><p id="description">${item.description}</p></div><div class="item__content__settings"><div class="item__content__settings__color"><label for="color-select">Choisir une couleur :</label><select name="color-select" id="colors"><option value="">--SVP, choisissez une couleur --</option></option></select></div><div class="item__content__settings__quantity"><label for="itemQuantity">Nombre d'article(s) (1-100) :</label><input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity"></div></div><div class="item__content__addButton"><button id="addToCart">Ajouter au panier</button></div></div>`;
    itemHtml.appendChild(productPage);

    item.colors.forEach(function(color) {
        console.log(color)
        let colorsList = document.getElementById("colors");
        // let option = "";
        // option.innerHTML = `<option value="${color}">${color}</option>`;
        colorsList.insertAdjacentHTML("beforeend", `<option value="${color}">${color}</option>`);
    })

// for (const product of itemsList) {
//     let productPage = document.createElement("article");
//     productPage.innerHTML = `<div class="item__img"><img src=${product.imageUrl} alt=${product.altTxt}></div><div class="item__content"><div class="item__content__titlePrice"><h1 id="title">${product.name}</h1><p>Prix : <span id="price">${product.price}</span>€</p></div><div class="item__content__description"><p class="item__content__description__title">Description :</p><p id="description">${product.description}</p></div><div class="item__content__settings"><div class="item__content__settings__color"><label for="color-select">Choisir une couleur :</label><select name="color-select" id="colors"><option value="">--SVP, choisissez une couleur --</option><option value="vert">vert</option><option value="blanc">blanc</option></select></div><div class="item__content__settings__quantity"><label for="itemQuantity">Nombre d'article(s) (1-100) :</label><input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity"></div></div><div class="item__content__addButton"><button id="addToCart">Ajouter au panier</button></div></div>`;
//     itemHtml.appendChild(productPage);
// }

};