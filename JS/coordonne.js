if (!localStorage.getItem("panier")) {
    let panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
}

let panier = JSON.parse(localStorage.getItem("panier"));
let coor = JSON.parse(localStorage.getItem("coor"));
var total_price;
var url = "https://api.kedufront.juniortaker.com/order/";

async function submit_order() {
    if (handling_zone_saisie() === -1) {
        return;
    }
    var nom1 = document.getElementById('nom').value;
    var prenom1 = document.getElementById('prenom').value;
    var email = document.getElementById('email').value;
    var adresse = document.getElementById('adresse').value;
    var tot_name = prenom1 + " " + nom1;
    var cart = adaptater_panier();

    var body = {
        "email": email,
        "name": tot_name,
        "address": adresse,
        "cart": cart
    };
    var commande_id;
    axios.post(url, body)
        .then(response => {
            commande_id = response.data.command_id;
            localStorage.removeItem('panier');
            display_id_order(commande_id);
        })
        .catch(error => {
            console.error(error);
        });
}

function adaptater_panier() {
    let order = [];

    panier.forEach(function(produit) {
        var item = {
            id: produit.id,
            amount: produit.count
        };
        console.log(item);
        order.push(item);
    });
    var ord = JSON.stringify(order)
    ord = JSON.parse(ord);
    return ord;
}

function handling_zone_saisie() {
    var nom = document.getElementById('nom').value;
    var prenom = document.getElementById('prenom').value;
    var email = document.getElementById('email').value;
    var adresse = document.getElementById('adresse').value;
    let regex = /^[a-zA-Z\-]+$/;

    if (nom === '' || prenom === '' || email === '' || adresse === '') {
        alert('Veuillez remplir tous les champs avant de soumettre le formulaire.');
        return -1;
    }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        alert('Veuillez remplir correctement votre e-mail.');
        return -1;
    }
    if (adresse.length < 5) {
        alert('Veuillez remplir correctement votre adresse.');
        return -1;
    }
    if (!(regex.test(prenom)) || !(regex.test(nom))) {
        alert('Caractère inccorect dans le prénom ou le nom.');
        return -1;
    }
    if (!panier.length) {
        alert('Votre panier est vide !');
        return -1;
    }
    return 0;
}

function display_id_order(idOrder) {
    var coord = document.getElementById('coordonne');
    coord.style.display = 'none';

    var coord = document.getElementById('zone_commande_id');
    coord.style.display = 'flex';

    var num = document.getElementById('num_order');
    num.textContent = idOrder;
}
