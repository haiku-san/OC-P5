
// // On récupère la liste de tous les produits
// let allItems = {};
// let item1 = {};

// let itemList = document.getElementById('items');

// fetch('http://localhost:3000/api/products')
//     .then(function(result) {
//         if (result.ok) {
//             return result.json();
//         }
//     })
//     .then(function(value) {
//         allItems = value;
//         console.log("Voici la liste de tous les éléments présents dans l'API : ");
//         console.log(value);
//         // On place chaque produit dans une variable
//         for (const item in allItems) {
//             console.log(`${item}: ${allItems[item]}`);
//             let newCard = document.createElement("a");
//             newCard.setAttribute("href", "./product.html?id=");
//             newCard.innerHTML = "<article><img src='.../product01.jpg' alt='Lorem ipsum dolor sit amet, Kanap name1'><h3 class='productName'>Kanap name1</h3><p class='productDescription'>Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p></article>";
            
//             itemList.appendChild(newCard);

            
            
//         }
//     })
//     .catch(function(err) {
//         console.log(err)
//     });

// // On récupère un produit
// fetch('http://localhost:3000/api/products/107fb5b75607497b96722bda5b504926')
//     .then(function(result) {
//         if (result.ok) {
//             return result.json();
//         }
//     })
//     .then(function(value) {
//         item1 = value;
//         console.log("Voici le premier élément de l'API : ");
//         console.log(value.name)
//         console.log(value);
//         // On itère pour récupérer chaque produit
//         for (const property in item1) {
//             console.log(`${property}: ${item1[property]}`);
//         }
//     })
//     .catch(function(err) {
//         console.log(err)
//     });

let row;
let id;
let elt;
let itemsListHtml = document.getElementById('items');


retrieveItems().catch(function(err) {
    console.log(err)
});

async function retrieveItems() {
    const response = await fetch('http://localhost:3000/api/products/');
    console.log(response);
    const itemsList = await response.json();
    console.log(itemsList);


    // Les trois solutions suivantes fonctionnent en utilisant 3 méthodes différentes : maps, forEach et for...of

    // On crée la liste de produits en utilisant les maps
    // const html = itemsList.map(function(product) {
    //     let newCard = document.createElement("a");
    //     newCard.setAttribute("href", `./product.html?id=${product._id}`);
    //     newCard.innerHTML = `<article><img src=${product.imageUrl} alt=${product.altTxt}><h3 class='productName'>${product.name}</h3><p class='productDescription'>${product.description}</p></article>`;
    //     itemsListHtml.appendChild(newCard);
    // });

    // On crée la liste de produits en utilisant forEach
    // itemsList.forEach(function(product) {
    //     let newCard = document.createElement("a");
    //     newCard.setAttribute("href", `./product.html?id=${product._id}`);
    //     newCard.innerHTML = `<article><img src=${product.imageUrl} alt=${product.altTxt}><h3 class='productName'>${product.name}</h3><p class='productDescription'>${product.description}</p></article>`;
    //     itemsListHtml.appendChild(newCard);
    // })


    // On crée la liste de produits en utilisant for...of
    for (const product of itemsList) {
        let newCard = document.createElement("a");
        newCard.setAttribute("href", `./product.html?id=${product._id}`);
        newCard.innerHTML = `<article><img src=${product.imageUrl} alt=${product.altTxt}><h3 class='productName'>${product.name}</h3><p class='productDescription'>${product.description}</p></article>`;
        itemsListHtml.appendChild(newCard);
    }

}

