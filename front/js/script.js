
// On récupère la liste de tous les produits
fetch('http://localhost:3000/api/products')
    .then(function(result) {
        if (result.ok) {
            return result.json();
        }
    })
    .then(function(value) {
        console.log("Voici la liste des éléments présents dans l'API : ");
        console.log(value);
    })
    .catch(function(err) {
        console.log(err)
    });

// On récupère les infos d'un seul produit
const product1 = fetch('http://localhost:3000/api/products')
    .then(function(result) {
        if (result.ok) {
            return result.json();
        }
    })
    .then(function(value) {
        singleElement = value.filter(obj => {
            return obj["_id"] === "415b7cacb65d43b2b5c1ff70f3393ad1"
        })
        console.log("Voici un seul élément de l'API : ");
        console.log(singleElement);
    })
    .catch(function(err) {
        console.log(err)
    })

