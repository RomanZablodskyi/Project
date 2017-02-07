//Todo Try to wrap all code. Not gu=ood keep code in window (global space)

window.onload = function loaded() {
    var data = getData(),
        header = document.getElementsByTagName("h1")[0],
        category = Object.keys(data)[0],
        total = 0,
        cart = [];

    header.textContent = category;
    createShopItems(data, category);

    var myScrollItems = new IScroll("#wrapper", {
        scrollX: true,
        scrollY: false,
        mouseWheel: true
    });

    document.getElementById("cart").addEventListener("click", function () {
        this.style.display = "none";
        header.textContent = "Корзина";
        document.getElementById("back").style.display = "block";
        var elems = document.getElementsByClassName("good");

        for(var i = elems.length - 1; i >= 0; i--){
            document.getElementsByClassName("scroller")[0].removeChild(elems[i]);
        }

        for(var j = 0; j < cart.length; j++)
            generateCartItem(cart[j]);

        //Todo Best points: doesn't use style in JS
        document.getElementById("cartSection").style.display = "block";
        document.getElementById("cartPrice").textContent = "$" + total;
        document.getElementById("wrapper").style.width = "0";
    });

    document.getElementById("back").addEventListener("click", function () {
        this.style.display = "none";
        returnToShop(data, header, category);
    });

    document.getElementsByName("backShopping")[0].addEventListener("click", function(){
        document.getElementById("back").style.display = "none";
        returnToShop(data, header, category)
    });

    document.getElementsByName("buy")[0].addEventListener("click", function () {
        for(var i = 0; i < cart.length; i++)
            console.log("Назва товару: " + cart[i].name + " | Кількість: " + cart[i].count + " | Ціна: " + (cart[i].count * cart[i].price));
        console.log("Загальна сума: $" + total);
        clearCart();
        deleteCartItems();
    });

    document.getElementsByClassName("clearAll")[0].addEventListener("click", function () {
        clearCart();
        deleteCartItems();
    });

    function getData() {
        var json, req = new XMLHttpRequest();
        req.open("GET", "json/data.json", false);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if(req.status == 200){
                    json = JSON.parse(req.responseText);
                }
            }
        };
        req.send(null);
        return json;
    }

    function generateItem(itemsGood, position){
        //Todo Best practise here use CreateFragment
        //Todo A lot of duplicate items
        //Todo You haven't separate logic for functions. Function execute everything.
        var total_price = document.getElementById('totalPrice');

        var goods = document.createElement("figure");
        goods.setAttribute("class", "good");

        var img = document.createElement("img");
        img.setAttribute("src", itemsGood.src);
        goods.appendChild(img);

        var name = document.createElement("figcaption");
        goods.appendChild(name);

        var nameItem = document.createElement("span");
        nameItem.textContent = itemsGood.name;
        name.appendChild(nameItem);

        var price = document.createElement("span");
        price.setAttribute("class", "price");
        price.textContent = "$" + itemsGood.price;
        name.appendChild(price);

        var amount = document.createElement("section");
        amount.setAttribute("class", "amount");

        var remBtn = document.createElement("button");
        remBtn.setAttribute("class", "btn-element remove");
        remBtn.textContent = "-";
        amount.appendChild(remBtn);
        amount.setAttribute("value", position);

        //Todo Keep all vars on top Optimise deletion
        remBtn.onclick = function(){    //удаление товара с корзины
            var pos = 0, count = 0;
            if(cart.length != 0){
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].name == itemsGood.name) {
                        total -= itemsGood.price;
                        total_price.textContent = "$" + total;
                        if(cart[i].count != 1){
                            cart[i].count--;
                            pos = i;
                            count = cart[pos].count
                        }
                        else{
                            cart.splice(i, 1);
                            count = 0;
                        }
                    }
                }
            }
            document.getElementsByClassName("count")[position].textContent = count;
        };

        var addBtn = document.createElement("button");
        addBtn.setAttribute("class", "btn-element add");
        addBtn.textContent = "+";
        amount.appendChild(addBtn);

        //Todo Duplicate function above. A little bit chagnes
        addBtn.onclick = function(){    //добавление товара в корзину
            var pos = 0, added = false;
            total += itemsGood.price;
            total_price.textContent = "$" + total;
            if(cart.length != 0) {
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].name == itemsGood.name) {
                        cart[i].count++;
                        pos = i;
                        added = true;
                    }
                }
            }
            if(cart.length == 0 || !added){
                cart.push({name: itemsGood.name, price: itemsGood.price, count: 1});
                pos = cart.length - 1;
            }
            document.getElementsByClassName("count")[position].textContent = cart[pos].count;
        };

        var amountSpan = document.createElement("span");
        amountSpan.textContent = "кількість";
        amount.appendChild(amountSpan);

        var amountCount = document.createElement("span");
        amountCount.setAttribute("class", "count");
        if(cart.length != 0){
            var flag = false;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name == itemsGood.name) {
                    amountCount.textContent = cart[i].count;
                    flag = true;
                }
                if(!flag)
                    amountCount.textContent = 0;
            }
        }
        else
            amountCount.textContent = 0;

        amount.appendChild(amountCount);

        goods.appendChild(amount);
        document.getElementsByClassName("scroller")[0].appendChild(goods);

//    Todo start line 18, finish line 130. Good functions less than 20 lines
    }

    function generateCartItem(cartItems) {
        var table = document.getElementsByTagName("tbody")[0];
        var tr = document.createElement("tr");

        var td = [];
        for(var i = 0; i < 3; i++){
            td[i] = document.createElement("td");
        }

        var btnDel = document.createElement("button");
        btnDel.setAttribute("class", "btn-element del");
        td[0].appendChild(btnDel);

        var name = document.createElement("span");
        name.textContent = cartItems.name;
        td[0].appendChild(name);

        var btnRem = document.createElement("button");
        btnRem.textContent = "-";
        btnRem.setAttribute("class", "btn-element remove");
        td[1].appendChild(btnRem);

        var count = document.createElement("span");
        count.textContent = cartItems.count;
        td[1].appendChild(count);

        var btnAdd = document.createElement("button");
        btnAdd.textContent = "+";
        btnAdd.setAttribute("class", "btn-element add");
        td[1].appendChild(btnAdd);

        var price = document.createElement("span");
        price.textContent = "$" + (cartItems.count * cartItems.price);
        td[2].appendChild(price);

        for(var j = 0; j < 3; j++)
            tr.appendChild(td[j]);

        table.appendChild(tr);


        //Todo Duplicates. Try to optimise this stuff
        btnRem.onclick = function () {
            if(cartItems.count > 0){
                /*cartItems.count--;
                 count.textContent = cartItems.count;
                 price.textContent = "$" + (cartItems.count * cartItems.price);
                 total -= cartItems.price;
                 document.getElementById('totalPrice').textContent = "$" + total;
                 document.getElementById('cartPrice').textContent = "$" + total;*/
                cartButtonsListener(count, price, cartItems, "rem");
            }
        };

        btnAdd.onclick = function () {
            /*cartItems.count++;
             count.textContent = cartItems.count;
             price.textContent = "$" + (cartItems.count * cartItems.price);
             total += cartItems.price;
             document.getElementById('totalPrice').textContent = "$" + total;
             document.getElementById('cartPrice').textContent = "$" + total;*/
            cartButtonsListener(count, price, cartItems, "add");
        };

        btnDel.onclick = function () {/*
         total -= cartItems.count * cartItems.price;
         document.getElementById('totalPrice').textContent = "$" + total;
         document.getElementById('cartPrice').textContent = "$" + total;*/
            cartButtonsListener(count, price, cartItems, "del");
            table.removeChild(tr);
            for(var i = 0; i < cart.length; i++)
                if(cart[i].name == cartItems.name)
                    cart.splice(i, 1);
        }
    }

    function cartButtonsListener(count, price, cartItems, operation) {
        switch (operation){
            case "rem":
                cartItems.count--;
                total -= cartItems.price;
                break;
            case "add":
                cartItems.count++;
                total += cartItems.price;
                break;
            case "del":
                total -= cartItems.count * cartItems.price;
                break;
        }
        if(operation != "del") {
            count.textContent = cartItems.count;
            price.textContent = "$" + (cartItems.count * cartItems.price);
        }
        document.getElementById('totalPrice').textContent = "$" + total;
        document.getElementById('cartPrice').textContent = "$" + total;
    }

    function createShopItems(data, category) {
        for(var i = 0; i < data[category].length; i++)
            generateItem(data[category][i], i);
    }


    function deleteCartItems() {
        var cartList = document.getElementsByTagName("tbody")[0];
        var cartItems = cartList.getElementsByTagName("tr");

        for(var j = cartItems.length - 1; j >= 0 ; j--)
            cartList.removeChild(cartItems[j]);
        document.getElementById("cartPrice").textContent = "$" + 0;
    }

    function returnToShop(data, header, category) {
        header.textContent = category;
        document.getElementById("cart").style.display = "block";
        document.getElementById("wrapper").style.width = "1246px";
        document.getElementById("cartSection").style.display = "none";
        createShopItems(data, category);
        deleteCartItems();
    }

    function clearCart() {
        cart = [];
        total = 0;
        document.getElementById('totalPrice').textContent = "$" + 0;
    }
};





