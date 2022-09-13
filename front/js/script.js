let row;
let id;
let elt;
let itemsListHtml = document.getElementById('items');


retrieveItems().catch(function(err) {
    console.log(err)
});

// Récupère les produits depuis l'API
async function retrieveItems() {
    const response = await fetch('http://localhost:3000/api/products/');
    const itemsList = await response.json();

    // On crée la liste de produits en utilisant forEach
    itemsList.forEach(function(product) {
        let newCard = document.createElement("a");
        newCard.setAttribute("href", `./product.html?id=${product._id}`);
        newCard.innerHTML = `<article><img src=${product.imageUrl} alt=${product.altTxt}><h3 class='productName'>${product.name}</h3><p class='productDescription'>${product.description}</p></article>`;
        itemsListHtml.appendChild(newCard);
    })

}