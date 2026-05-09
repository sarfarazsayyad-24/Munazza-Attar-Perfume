JavaScriptwindow.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    },1000);

});


// Mobile Menu

const menuBtn = document.querySelector(".menu-btn");

const mobileMenu = document.querySelector(".mobile-menu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("show");

});


// Product Data

const products = [

    {
        name:"Royal Oud",
        price:"₹999",
        image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
    },

    {
        name:"Golden Musk",
        price:"₹799",
        image:"https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
    },

    {
        name:"Black Amber",
        price:"₹1199",
        image:"https://images.unsplash.com/photo-1615634262417-0b0f8f03d4d0?q=80&w=800&auto=format&fit=crop"
    }

];


// Show Products

const productContainer = document.querySelector(".products");

products.forEach((product)=>{

    productContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <p>${product.price}</p>

            <button onclick="addToCart()">
                Add To Cart
            </button>

        </div>

    `;

});


// Cart System

let cartCount = 0;

function addToCart(){

    cartCount++;

    document.querySelector(".cart-count").innerText = cartCount;

    alert("Product Added To Cart");

}


// Smooth Scroll

document.querySelectorAll("a").forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({
            behavior:"smooth"
        });

    });

});
