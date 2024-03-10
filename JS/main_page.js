if (!localStorage.getItem("panier")) {
    let panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
}

let panier = JSON.parse(localStorage.getItem("panier"));
var url = "https://api.kedufront.juniortaker.com/";
var total_price;

/**
 * add to cart.
 * @constructor
 * @param {list} item - it's list of article
 */
function ajouterAuPanier(item) {
    var produit = {
        id: item._id,
        name: item.name,
        price: item.price,
        count: 1
    };

    if (produitDejaDansPanier(item._id)) {
        var index = getIndexProduitDansPanier(item._id);
        panier[index].count++;
    } else {
        panier.push(produit);
    }
    localStorage.setItem("panier", JSON.stringify(panier));
    mettreAJourPanier();
}

function mettreAJourPanier() {
    var listePanier = document.getElementById('list_panier');
    total_price = 0;

    listePanier.innerHTML = '';
    panier.forEach(function(produit) {
        const divArtPan = document.createElement('div');
        divArtPan.classList.add('divArtPan');

        const zoneImgCart = document.createElement('div');
        zoneImgCart.classList.add('zoneImgCart');

        const itemImg = document.createElement('img');
        var id_t = produit.id + '';
        var url_img = url + "item/picture/" + id_t;
        itemImg.src = url_img;

        const divInfo = document.createElement('div');
        divInfo.classList.add('div_info');

        const nameItem = document.createElement('p');
        nameItem.textContent = produit.name;
        nameItem.classList.add('name_item_pan');


        const priceItem = document.createElement('p');
        priceItem.textContent = produit.price.toFixed(2) + " €";
        priceItem.classList.add('price_item_pan');

        const divCount = document.createElement('div');
        divCount.classList.add('div_count');

        const suppOneButton = document.createElement('button');
        const iconSupp = document.createElement('i');
        iconSupp.classList.add('fa-solid', 'fa-minus');
        suppOneButton.appendChild(iconSupp);
        suppOneButton.classList.add('add_sup_ele');
        divCount.appendChild(suppOneButton);

        const nbrItem = document.createElement('p');
        nbrItem.textContent = "X " + produit.count.toString();
        nbrItem.classList.add('nbr_item_pan');
        divCount.appendChild(nbrItem);

        const addOneButton = document.createElement('button');
        const iconAdd = document.createElement('i');
        iconAdd.classList.add('fa-solid', 'fa-plus');
        addOneButton.appendChild(iconAdd);
        addOneButton.classList.add('add_sup_ele');
        divCount.appendChild(addOneButton);

        const delCartButton = document.createElement('button');
        const cartIcon = document.createElement('i');
        cartIcon.classList.add('fa-regular', 'fa-trash-can');
        delCartButton.appendChild(cartIcon);
        delCartButton.classList.add('del_pan_button');

        delCartButton.addEventListener('click', function() {
            supprimerDuPanier(produit.id);
        });

        addOneButton.addEventListener('click', function() {
            produit.count++;
            localStorage.setItem("panier", JSON.stringify(panier));
            mettreAJourPanier();
        });

        suppOneButton.addEventListener('click', function() {
            if (produit.count > 0) {
                produit.count--;
                localStorage.setItem("panier", JSON.stringify(panier));
                mettreAJourPanier();
            }
        });
        total_price += (produit.price * produit.count);

        divArtPan.appendChild(delCartButton);
        divArtPan.appendChild(divCount);
        divInfo.appendChild(nameItem);
        divInfo.appendChild(priceItem);
        zoneImgCart.appendChild(itemImg);
        divArtPan.appendChild(zoneImgCart);
        divArtPan.appendChild(divInfo);
        listePanier.appendChild(divArtPan);
    });
    displayTotal();
}

/** function sort cart */
function triPanier() {
    panier.forEach(function(produit) {
        if (produit.count === 0) {
            supprimerDuPanier(produit.id);
        }
    });
}

/**
 * adelete to cart.
 * @constructor
 * @param {int} id - it's id of article
 */
function supprimerDuPanier(id) {
    const fil_panier = panier.filter((prod) => prod.id !== id);

    panier = fil_panier;
    localStorage.setItem("panier", JSON.stringify(panier));
    mettreAJourPanier();
}

/**
 * the function tests if the item is already in the cart
 * @constructor
 * @param {int} id - it's id of article
 */
function produitDejaDansPanier(id) {
    return panier.some(function(produit) {
        return produit.id === id;
    });
}

/**
 * get index to article in cart
 * @constructor
 * @param {int} id - it's id of article
 */
function getIndexProduitDansPanier(id) {
    for (var i = 0; i < panier.length; i++) {
        if (panier[i].id === id) {
            return i;
        }
    }
    return -1;
}

/** display total price or cart empty */
function displayTotal() {
    var listePanier = document.getElementById('list_panier');

    if (!(panier.length === 0)) {
        const divTot = document.createElement('div');
        divTot.classList.add('divTot');

        const priceTot = document.createElement('p');
        priceTot.textContent = "TOTAL: " + total_price.toFixed(2) + " €";
        priceTot.classList.add('priceTot');

        const buyButton = document.createElement('button');
        buyButton.textContent = "Valider mon panier";
        buyButton.classList.add('buyButton');

        buyButton.addEventListener('click', function() {
            window.location.href = "validate_cart.html";
        });

        divTot.appendChild(priceTot);
        divTot.appendChild(buyButton);
        listePanier.appendChild(divTot);
    } else {
        const divTot = document.createElement('div');
        divTot.classList.add('divTot');

        const emptyPan = document.createElement('p');
        emptyPan.textContent = "Aucun produit dans le panier !";
        emptyPan.classList.add('emptyCart');

        const emptyImg = document.createElement('img');
        emptyImg.src = "image/empty-cart.png";
        emptyImg.classList.add('emptyImg');

        divTot.appendChild(emptyPan);
        listePanier.appendChild(emptyImg);
        listePanier.appendChild(divTot);
    }
}

/** display all article in first page */
async function displayAllArt() {
    try {
        var url_item = url + "item/";
        const response = await axios.get(url_item);
        const items = response.data;
        const divAllArticle = document.getElementById('article_bdd');

        if (items && items.length > 0) {
            items.forEach(item => {
                const zoneItem = document.createElement('div');
                zoneItem.classList.add('zone_item');

                const itemName = document.createElement('p');
                itemName.textContent = item.name;
                itemName.classList.add('name_item');


                const itemImg = document.createElement('img');
                var id_t = item._id + '';
                var url_img = url + "item/picture/" + id_t;
                itemImg.src = url_img;

                const zonePrice = document.createElement('div');
                zonePrice.classList.add('zone_price');

                const itemPrice = document.createElement('p');
                itemPrice.textContent = item.price.toFixed(2) + " €";
                itemPrice.classList.add('price_item');

                const addToCartButton = document.createElement('button');
                const cartIcon = document.createElement('i');
                cartIcon.classList.add('fa-solid', 'fa-cart-shopping');
                addToCartButton.appendChild(cartIcon);
                addToCartButton.classList.add('add_to_cart_button');

                itemImg.addEventListener('click', function() {
                    openArticle(item._id);
                });

                itemName.addEventListener('click', function() {
                    openArticle(item._id);
                });

                addToCartButton.addEventListener('click', function() {
                    ajouterAuPanier(item);
                });

                zoneItem.appendChild(itemName);
                zoneItem.appendChild(itemImg);
                zonePrice.appendChild(itemPrice);
                zoneItem.appendChild(addToCartButton);
                zoneItem.appendChild(zonePrice);
                divAllArticle.appendChild(zoneItem);
            });
        } else {
            console.log("Aucun item trouvé");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        throw error;
    }
}

/** open or close cart and update cart */
function togglePanier() {
    var panierContent = document.getElementById('panierContent');
    var backBlack = document.getElementById('back_black_panier');

    if (panierContent.style.display === 'none' || panierContent.style.display === '') {
        panierContent.style.display = 'block';
        backBlack.style.display = 'block';
        triPanier();
        mettreAJourPanier();
        disableScroll();
    } else {
        panierContent.style.display = 'none';
        backBlack.style.display = 'none';
    }
}

/**
 * open Article and display all info
 * @constructor
 * @param {int} id - it's id of article
 */
async function openArticle(id) {
    var choiceArticle = document.getElementById('choice_article');
    var backGround = document.getElementById('back_black_art');

    choiceArticle.innerHTML = '';
    disableScroll();
    try {
        var url_item = url + "item/";
        const response = await axios.get(url_item);
        const items = response.data;
        console.log(items);
        if (items) {
            items.forEach(item => {
                if (id === item._id) {
                    const closeArt = document.createElement('button');
                    const cartIcon = document.createElement('i');
                    cartIcon.classList.add('fa-solid', 'fa-xmark');
                    closeArt.appendChild(cartIcon);
                    closeArt.classList.add('close_art');

                    closeArt.addEventListener('click', function() {
                        closeArticle();
                    });

                    const zoneItem = document.createElement('div');
                    zoneItem.classList.add('all_zone_art');

                    const trait = document.createElement('div');
                    trait.classList.add('trait');

                    const zoneImgArt = document.createElement('div');
                    zoneImgArt.classList.add('zoneImgArt');

                    const itemImg = document.createElement('img');
                    var id_t = item._id + '';
                    var url_img = url + "item/picture/" + id_t;
                    itemImg.src = url_img;
                    zoneImgArt.appendChild(itemImg);

                    const zoneNameArt = document.createElement('div');
                    zoneNameArt.classList.add('zoneNameArt');

                    const artName = document.createElement('p');
                    artName.textContent = item.name;
                    artName.classList.add('art_name');
                    zoneNameArt.appendChild(artName);

                    const zonePriPan = document.createElement('div');
                    zonePriPan.classList.add('zonePriPan');

                    const artPrice = document.createElement('p');
                    artPrice.textContent = item.price.toFixed(2) + " €";
                    artPrice.classList.add('art_price');
                    zonePriPan.appendChild(artPrice);
                    zoneNameArt.appendChild(zonePriPan);

                    const addInCart = document.createElement('button');
                    addInCart.textContent = "Ajouter au panier";
                    addInCart.classList.add('art_add_cart');
                    zonePriPan.appendChild(addInCart);

                    addInCart.addEventListener('click', function() {
                        ajouterAuPanier(item);
                    });

                    const titleDesc = document.createElement('p');
                    titleDesc.textContent = "Description";
                    titleDesc.classList.add('art_t_description');

                    const traitDesc = document.createElement('div');
                    traitDesc.classList.add('trait_desc');

                    const artDesc = document.createElement('p');
                    artDesc.textContent = item.description;
                    artDesc.classList.add('art_description');

                    const artMade = document.createElement('p');
                    artMade.textContent = "Date de sortie : " + item.createdIn;
                    artMade.classList.add('art_made');

                    zoneItem.appendChild(closeArt);
                    zoneItem.appendChild(zoneImgArt);
                    zoneItem.appendChild(trait);
                    zoneItem.appendChild(zoneNameArt);
                    zoneItem.appendChild(titleDesc);
                    zoneItem.appendChild(traitDesc);
                    zoneItem.appendChild(artDesc);
                    zoneItem.appendChild(artMade);
                    choiceArticle.appendChild(zoneItem);
                }
            });
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        throw error;
    }
    choiceArticle.style.display = 'flex';
    backGround.style.display = 'block';
}

/** close page cart */
function closePanier() {
    var panierContent = document.getElementById('panierContent');
    var backBlack = document.getElementById('back_black_panier');

    if (!(panierContent.style.display === 'none' || panierContent.style.display === '')) {
        panierContent.style.display = 'none';
        backBlack.style.display = 'none';
        enableScroll();
    }
}

/** close page article */
function closeArticle() {
    var artDisplay = document.getElementById('choice_article');
    var backBlack = document.getElementById('back_black_art');

    if (!(artDisplay.style.display === 'none' || artDisplay.style.display === '')) {
        artDisplay.style.display = 'none';
        backBlack.style.display = 'none';
        enableScroll();
    }
}

/** disable scroll of body */
function disableScroll() {
    document.body.style.overflow = 'hidden';
}

/** enable scroll of body */
function enableScroll() {
    document.body.style.overflow = '';
}

/** get data to API */
async function fetchData() {
    const url_item = url + "item/";
    const response = await axios.get(url_item);
    const items = response.data;
    return items;
}

/**
 * search id with name
 * @constructor
 * @param {string} name - it's name of article
 */
async function searchIdWithName(name) {
    const items = await fetchData();

    for (const item of items) {
        if (str_cmp(item.name, name)) {
            return item._id;
        }
    }
    return -1;
}

/** open article with search */
function openWithSearch() {
    var name = document.getElementById('searchInput').value;
    searchIdWithName(name).then(id => {
        if (id != -1) {
            openArticle(id);
            document.getElementById('searchInput').value = '';
        }
    });
}

/** compare two strng */
function str_cmp(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

async function getSuggestions(nameSearch) {
    const items = await fetchData();
    const suggestions = items.filter(item => item.name.toLowerCase().startsWith(nameSearch.toLowerCase()));
    return suggestions;
}

async function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const sugSearch = document.getElementById('sugSearch');
    sugSearch.innerHTML = '';

    if (searchInput.length > 0) {
        const itemFilter = await getSuggestions(searchInput);

        itemFilter.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            li.addEventListener('click', function() {
                document.getElementById('searchInput').value = item.name;
            });
            sugSearch.appendChild(li);
        });
    }
}

function closeSugg() {
    document.addEventListener('click', function(event) {
        const searchInput = document.getElementById('searchInput');
    const sugSearch = document.getElementById('sugSearch');

    if (event.target !== searchInput && event.target.parentNode !== sugSearch) {
        sugSearch.innerHTML = '';
    }
    });
}
