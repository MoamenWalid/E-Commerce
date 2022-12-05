// Documents
const buyingIcon = document.querySelector(".buying");
const buyingIconSpan = document.querySelector(".buying span");
const buyingSetting = document.querySelector(".buying-setting");
const productsSection = document.querySelector(".products");
const layer = document.querySelector(".layer.green");
const closeIcon = document.querySelector(".close");
const addCards = document.querySelectorAll(".add");
const addCardsSpans = document.querySelectorAll(".add span");
const images = document.querySelectorAll(".photo img");
const nameProducts = document.querySelectorAll(".name-of-product");
const priceProducts = document.querySelectorAll(".price-of-product");
const total = document.querySelector(".total span");
const clearAll = document.querySelector(".clear-all button");

// Variables
let digitOfAmount = 0;
let totalPrice = 0;

// Array 
let card = [];
let numCard = [];
let amount = [];

if (window.localStorage.getItem('products')) {
  numCard = JSON.parse(window.localStorage.getItem('numCard'));
  card = JSON.parse(window.localStorage.getItem('products'));
  amount = JSON.parse(window.localStorage.getItem('amountItem'));
}

class Commerce {

  // Add Or Remove Cards Setting
  static addAndRemoveCard() {
    layer.classList.toggle('move-bottom');
    buyingSetting.classList.toggle('right');
  }

  // Function To Create Information To Item
  static createInformation(index) {
    // Object For Items Information
    const informationForItems = {
      img: images[index].src,
      id: addCards[index].id,
      name: nameProducts[index].textContent,
      price: priceProducts[index].textContent
    }

    numCard.push(index);
    window.localStorage.setItem('numCard', JSON.stringify(numCard));
    card.push(informationForItems); 
  }

  // Add Information to Local Storage 
  static addToLocalStorage(card) {
    window.localStorage.setItem("products", JSON.stringify(card));
  }

  // Add Sentence 'In Card'
  static addInCard(numCard) {
    if (window.localStorage.getItem('numCard')) {
      addCardsSpans.forEach((span) => {
        span.innerHTML = "Add To Card";
      })  
      for(let counter = 0; counter < numCard.length; counter++) {
        addCardsSpans[numCard[counter]].innerHTML = "In Card"; 
      }
    }
  }

  // Add Item To Products Section
  static addProduct() {
    productsSection.innerHTML = ''; 
    let locProduct = JSON.parse(window.localStorage.getItem('products'));
    for(let counter = 0; counter < locProduct.length; counter++) {
      productsSection.innerHTML += `
      <div class="product" id="${locProduct[counter].id}">
      <div class="item">
        <div class="photo">
          <img class="w-100" src="${locProduct[counter].img}" alt="product">
        </div>
        <div class="text">
          <h4 class="m-0">${locProduct[counter].name}</h4>
          <p class="m-0 price">${locProduct[counter].price}</p>
          <span class="remove" id="${locProduct[counter].id}" role="button">Remove</span>
          <div class="inc-dec">
            <div class="minus"><i class="fa-solid fa-minus" role="button"></i></div>
            <span>1</span>
            <div class="plus"><i class="fa-solid fa-plus" role="button"></i></div>
          </div>
        </div>
      </div>
      </div>
      `
    }
  }

  // Remove Item From Products Section
  static removeProduct() {
    const product = document.querySelectorAll(".product");
    const removeProducts = document.querySelectorAll(".product .remove");

    removeProducts.forEach((removeItem, index) => {
      removeItem.addEventListener('click', () => {
        for(let counter = 0; counter < card.length; counter++) {
          if (removeItem.id === card[counter].id) {
            product[index].remove();
            card.splice(counter, 1);
            Commerce.addToLocalStorage(card);
            numCard.splice(counter, 1);
            window.localStorage.setItem('numCard', JSON.stringify(numCard));
            Commerce.addInCard(numCard);
            amount.splice(counter, 1);
            window.localStorage.setItem('amountItem', JSON.stringify(amount));
            Commerce.numItem(amount);
            Commerce.addPriceAndAmount();
          }
        }
      })
    })
  }

  // Add Amount To Local Storage
  static numItem(amount) {
    const amountNum = document.querySelectorAll(".inc-dec span");
    amount = [];
    amountNum.forEach((numItem) => {
      amount.push(parseInt(numItem.innerHTML));
    })
    window.localStorage.setItem('amountItem', JSON.stringify(amount));
  }

  // Plus And Minus Number In Amount 
  static addDecNum() {
    const plusNumbers = document.querySelectorAll(".inc-dec .plus");
    const minusNumbers = document.querySelectorAll(".inc-dec .minus");
    const amountNum = document.querySelectorAll(".inc-dec span");

    plusNumbers.forEach((plusNum, index) => {
      plusNum.addEventListener('click', () => {
        amountNum[index].innerHTML++;
        Commerce.numItem(amount);
        Commerce.addPriceAndAmount();
      })
    })

    minusNumbers.forEach((minusNum, index) => {
      minusNum.addEventListener('click', () => {
        if (amountNum[index].innerHTML > 1) {
          amountNum[index].innerHTML--;
          Commerce.numItem(amount);
          Commerce.addPriceAndAmount();
        }
      })
    })
  } 

  // Add Amount To Span
  static addAmountToSpan() {
    const amountNum = document.querySelectorAll(".inc-dec span");
    JSON.parse(window.localStorage.getItem("amountItem")).forEach((num, index) => {
      amountNum[index].innerHTML = num;
    })
  }

  // Add Price And Amount
  static addPriceAndAmount() {
    const priceItem = document.querySelectorAll(".text p");
    digitOfAmount = 0;
    totalPrice = 0;
    const amountNum = document.querySelectorAll(".inc-dec span");
    amountNum.forEach((num, index) => {
      digitOfAmount += parseInt(num.innerHTML);
      totalPrice += parseFloat(priceItem[index].innerHTML.slice(1) * num.innerHTML);
    })
    buyingIconSpan.innerHTML = digitOfAmount;
    total.innerHTML = `$${totalPrice.toFixed(2)}`;
  }
} 

if (window.localStorage.getItem('products')) { 
  Commerce.addInCard(numCard);
  Commerce.addProduct();
  Commerce.addDecNum();
  Commerce.addAmountToSpan();
  Commerce.addPriceAndAmount();
}


buyingIcon.addEventListener('click', () => {
  Commerce.addAndRemoveCard();
})

closeIcon.addEventListener('click', () => {
  Commerce.addAndRemoveCard();
})

addCards.forEach((addCard, index) => {
  addCard.addEventListener('click', () => {
    Commerce.addAndRemoveCard();

    // Check To New Card
    if (!numCard.includes(index)) {
      Commerce.createInformation(index);
    }

    Commerce.addToLocalStorage(card);
    Commerce.addInCard(numCard);
    Commerce.addProduct();
    Commerce.removeProduct();
    Commerce.addDecNum();
    Commerce.addAmountToSpan();  
    Commerce.addPriceAndAmount(); 
  })
})

clearAll.addEventListener('click', () => {
  productsSection.innerHTML = '';
  card = [], numCard = [], amount = [];
  window.localStorage.setItem('numCard', JSON.stringify(numCard));
  window.localStorage.setItem('products', JSON.stringify(card));
  window.localStorage.setItem('amountItem', JSON.stringify(amount));
  Commerce.addInCard(numCard);
  Commerce.addPriceAndAmount();
})

if (productsSection.innerHTML !== "") {
  Commerce.removeProduct();
}