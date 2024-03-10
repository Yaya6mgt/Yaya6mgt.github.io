if (!localStorage.getItem("panier")) {
    let panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
}

let panier = JSON.parse(localStorage.getItem("panier"));
var total_price;
var url = "https://api.kedufront.juniortaker.com/";

function upArtCart(item) {
    var index = getIndexProduitDansPanier(item.id);
    panier[index].count++;

    localStorage.setItem("panier", JSON.stringify(panier));
    MAJPanier();
}

function downArtCart(item) {
    var index = getIndexProduitDansPanier(item.id);

    if (panier[index].count > 1) {
        panier[index].count--;
        localStorage.setItem("panier", JSON.stringify(panier));
        MAJPanier();
    }
}

function supToCart(id) {
    const fil_panier = panier.filter((prod) => prod.id !== id);

    panier = fil_panier;
    localStorage.setItem("panier", JSON.stringify(panier));
    MAJPanier();
}

function getIndexProduitDansPanier(id) {
    for (var i = 0; i < panier.length; i++) {
        if (panier[i].id === id) {
            return i;
        }
    }
    return -1;
}

function countArticle() {
    var count = 0;

    panier.forEach(function(produit) {
        count += produit.count;
    });
    return count;
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

function MAJPanier() {
    var listePanier = document.getElementById('disp_panier');

    total_price = 0;
    listePanier.innerHTML = '';

    const divTitle = document.createElement('div');
    divTitle.classList.add('div_title_art');

    const textTitle = document.createElement('h2');
    textTitle.classList.add('textTitle');
    textTitle.textContent = "Mon Panier";

    const nbrProduit = document.createElement('p');
    nbrProduit.classList.add('nbr_prod');
    const qProd = countArticle();
    nbrProduit.textContent = "(" + qProd + " produit(s))";

    divTitle.appendChild(textTitle);
    divTitle.appendChild(nbrProduit);
    listePanier.appendChild(divTitle);
    panier.forEach(function(produit) {
        const divArtPan = document.createElement('div');
        divArtPan.classList.add('div_art');

        const zoneImgCart = document.createElement('div');
        zoneImgCart.classList.add('zoneImgCart');

        const itemImg = document.createElement('img');
        var id_t = produit.id + '';
        var url_img = url + "item/picture/" + id_t;
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

        const delCartButton = document.createElement('button');
        const cartIcon = document.createElement('i');
        cartIcon.classList.add('fa-regular', 'fa-trash-can');
        delCartButton.appendChild(cartIcon);
        delCartButton.classList.add('del_pan_button');
        zoneDelName.appendChild(delCartButton);

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

        const suppOneButton = document.createElement('button');
        const iconSupp = document.createElement('i');
        iconSupp.classList.add('fa-solid', 'fa-minus');
        suppOneButton.appendChild(iconSupp);
        suppOneButton.classList.add('add_sup_ele');
        zoneCountUpDown.appendChild(suppOneButton);

        const nbrItem = document.createElement('p');
        nbrItem.textContent = produit.count.toString();
        nbrItem.classList.add('nbr_item_pan');
        zoneCountUpDown.appendChild(nbrItem);

        const addOneButton = document.createElement('button');
        const iconAdd = document.createElement('i');
        iconAdd.classList.add('fa-solid', 'fa-plus');
        addOneButton.appendChild(iconAdd);
        addOneButton.classList.add('add_sup_ele');
        zoneCountUpDown.appendChild(addOneButton);

        delCartButton.addEventListener('click', function() {
            supToCart(produit.id);
        });

        suppOneButton.addEventListener('click', function() {
            downArtCart(produit);
        });

        addOneButton.addEventListener('click', function() {
            upArtCart(produit);
        });

        divArtPan.appendChild(zoneImgCart);
        divArtPan.appendChild(zoneText);

        listePanier.appendChild(divArtPan);

        total_price += produit.count * produit.price;
    });
    MAJTotal();
}

function MAJTotal() {
    var listePanier = document.getElementById('disp_total');

    listePanier.innerHTML = '';

    const divTitle = document.createElement('div');
    divTitle.classList.add('div_title_art');

    const textTitle = document.createElement('h2');
    textTitle.classList.add('textTitle', "title_total");
    textTitle.textContent = "TOTAL";
    divTitle.appendChild(textTitle);

    const divTotal = document.createElement('div');
    divTotal.classList.add('div_total');

    const priceTotPanier = document.createElement('div');
    priceTotPanier.classList.add('priceTotPanier');

    const textPanier = document.createElement('p');
    textPanier.textContent = "Panier";
    textPanier.classList.add('namePanier');
    priceTotPanier.appendChild(textPanier);

    const pricePanier = document.createElement('p');
    pricePanier.textContent = total_price.toFixed(2);
    pricePanier.classList.add('pricePanier');
    priceTotPanier.appendChild(pricePanier);
    divTotal.appendChild(priceTotPanier);

    const trait1 = document.createElement('div');
    trait1.classList.add('trait');
    divTotal.appendChild(trait1);

    const lineRetrait1 = document.createElement('div');
    lineRetrait1.classList.add('lineRetrait');

    const iconStore = document.createElement('i');
    iconStore.classList.add('fa-solid', 'fa-store');
    lineRetrait1.appendChild(iconStore);
    const optionRet = document.createElement('p');
    optionRet.textContent = "Retrait en magasin";
    optionRet.classList.add('optionRet');
    lineRetrait1.appendChild(optionRet);
    const dispoRet = document.createElement('p');
    dispoRet.textContent = "Indisponible";
    dispoRet.classList.add('dispoRet', 'indispo');
    lineRetrait1.appendChild(dispoRet);
    divTotal.appendChild(lineRetrait1);

    const lineRetrait2 = document.createElement('div');
    lineRetrait2.classList.add('lineRetrait');

    const iconCar = document.createElement('i');
    iconCar.classList.add('fa-solid', 'fa-truck');
    lineRetrait2.appendChild(iconCar);
    const optionRet1 = document.createElement('p');
    optionRet1.textContent = "Livraison";
    optionRet1.classList.add('optionRet');
    lineRetrait2.appendChild(optionRet1);
    const dispoRet1 = document.createElement('p');
    dispoRet1.textContent = "Gratuit";
    dispoRet1.classList.add('dispoRet', 'dispo');
    lineRetrait2.appendChild(dispoRet1);
    divTotal.appendChild(lineRetrait2);

    const trait2 = document.createElement('div');
    trait2.classList.add('trait');
    divTotal.appendChild(trait2);

    const priceTva = document.createElement('div');
    priceTva.classList.add('linePriceTva');

    const totaltxt = document.createElement('p');
    totaltxt.textContent = "TOTAL";
    totaltxt.classList.add('txt_tva');
    priceTva.appendChild(totaltxt);
    const totalTVA = document.createElement('p');
    totalTVA.textContent = "(TTC comprise)";
    totalTVA.classList.add('ttc');
    priceTva.appendChild(totalTVA);
    const totalPrice = document.createElement('p');
    totalPrice.textContent = total_price.toFixed(2) + " €";
    totalPrice.classList.add('totalPrice');
    priceTva.appendChild(totalPrice);
    divTotal.appendChild(priceTva);

    const trait3 = document.createElement('div');
    trait3.classList.add('trait');
    divTotal.appendChild(trait3);

    var submitButton =document.createElement('button');
    submitButton.type =  'button';
    submitButton.textContent = 'Valider Commande';

    submitButton.addEventListener('click', function() {
        window.location.href = "coordonne.html";
    });
    divTotal.appendChild(submitButton);

    listePanier.appendChild(divTitle);
    listePanier.appendChild(divTotal);
}

window.onload = MAJPanier;