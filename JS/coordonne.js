if (!localStorage.getItem("panier")) {
    let panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
}

let panier = JSON.parse(localStorage.getItem("panier"));
let coor = JSON.parse(localStorage.getItem("coor"));
var total_price;
var url = "https://api.kedufront.juniortaker.com/";

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
    axios.post(url +"order/", body)
        .then(response => {
            commande_id = response.data.command_id;
            alert("Votre numéro de commande est: " + commande_id);
            display_id_order(commande_id);
            localStorage.removeItem('panier');
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

    var zone_com = document.getElementById('zone_commande_id');
    zone_com.style.display = 'flex';

    var num = document.getElementById('num_order');
    num.textContent = idOrder;

    panier.forEach(function(produit) {
        const divArtPan = document.createElement('div');
        divArtPan.classList.add('div_art');

        const zoneImgCart = document.createElement('div');
        zoneImgCart.classList.add('zoneImgCart');

        const itemImg = document.createElement('img');
        var id_t = produit.id + '';
        var url_img = url + "item/picture/" + produit.id;
        itemImg.src = url_img;
        zoneImgCart.appendChild(itemImg);

        const zoneText = document.createElement('div');
        zoneText.classList.add('zoneText');

        const zoneDelName = document.createElement('div');
        zoneDelName.classList.add('zone_del_name');

        const nameArt = document.createElement('p');
        nameArt.textContent = produit.name;
        nameArt.classList.add('name_art');
        zoneDelName.appendChild(nameArt);
        zoneText.appendChild(zoneDelName);

        const zonePriceCount = document.createElement('div');
        zonePriceCount.classList.add('zone_p_c');
        zoneText.appendChild(zonePriceCount);

        const priceArt = document.createElement('p');
        priceArt.textContent = totalPriceForOneArt(produit.id) + " ";
        priceArt.classList.add('price_art');
        zonePriceCount.appendChild(priceArt);

        const euro = document.createElement('span');
        const iconEuro = document.createElement('i');
        iconEuro.classList.add('fa-solid', 'fa-euro-sign');
        euro.appendChild(iconEuro);
        priceArt.appendChild(euro);

        const zoneCountUpDown = document.createElement('div');
        zoneCountUpDown.classList.add('zone_count');
        zonePriceCount.appendChild(zoneCountUpDown);

        const nbrItem = document.createElement('p');
        nbrItem.textContent = produit.count.toString();
        nbrItem.classList.add('nbr_item_pan');
        zoneCountUpDown.appendChild(nbrItem);
        divArtPan.appendChild(zoneImgCart);
        divArtPan.appendChild(zoneText);

        zone_com.appendChild(divArtPan);
    });

}

function totalPriceForOneArt(id)
{
    var count = 0;

    panier.forEach(function(produit) {
        if (id === produit.id) {
            count = produit.price * produit.count;
        }
    });
    return count.toFixed(2);
}
