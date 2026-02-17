let products = [];
let cartCount = 0;

const loadProducts = () => {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(json => {
            products = json;
            if (document.getElementById("products-grid")) {
                displayProducts(products);
                loadCategories();
            }
            if (document.getElementById("trending-grid")) {
                displayTrendingProducts();
            }
        });
};


const loadCategories = () => {
    fetch("https://fakestoreapi.com/products/categories")
        .then((res) => res.json())
        .then((categories) => displayCategories(categories))
};

const displayCategories = (categories) => {
    const container = document.getElementById("category-filters");

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline btn-primary btn-sm category-btn";
        btn.setAttribute("data-category", category);
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);

        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-btn").forEach((b) => {
                b.classList.remove("active", "btn-primary");
                b.classList.add("btn-outline");
            });

            btn.classList.add("btn-primary");
            btn.classList.remove("active", "btn-outline");

            filterByCategory(category);
        });

        container.appendChild(btn);
    });
};

const filterByCategory = (category) => {
    if (category === "all") {
        displayProducts(products);
    } else {
        const filtered = products.filter((p) => p.category === category);
        displayProducts(filtered);
    }
};

const displayProducts = (productsToShow) => {
    const container = document.getElementById("products-grid");
    container.innerHTML = "";

    productsToShow.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
};

const createProductCard = (product) => {
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-xl product-card";

    card.innerHTML = `
        <figure class="px-4 pt-4 h-48">
            <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
        </figure>
        <div class="card-body">
            <h2 class="card-title text-sm">${product.title.substring(0, 40)}${product.title.length > 40 ? "..." : ""}</h2>
            <div class="badge badge-secondary">${product.category}</div>
            <p class="text-xl font-bold text-primary">$${product.price}</p>
            <div class="flex items-center gap-2">
                <div class="rating rating-xs">
                    ${generateRatingStars(product.rating.rate)}
                </div>
                <span class="text-sm">(${product.rating.count})</span>
            </div>
            <div class="card-actions justify-end mt-4">
                <button class="btn btn-outline btn-sm" onclick="showProductDetails(${product.id})">Details</button>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Add</button>
            </div>
        </div>
    `;

    return card;
};

const generateRatingStars = (rating) => {
    const fullStars = Math.round(rating); // Round to nearest whole number
    let stars = "";

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" disabled checked />';
        } else {
            stars += '<input type="radio" name="rating" class="mask mask-star-2 bg-orange-400" disabled />';
        }
    }

    return stars;
};

const displayTrendingProducts = () => {
    const container = document.getElementById("trending-grid");
    container.innerHTML = "";

    const trending = [...products]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 3);

    trending.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
};

const showProductDetails = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <h3 class="font-bold text-2xl mb-4">${product.title}</h3>
        <img src="${product.image}" alt="${product.title}" class="modal-product-image w-full mb-4" />
        <div class="badge badge-secondary mb-4">${product.category}</div>
        <p class="text-2xl font-bold text-primary mb-2">$${product.price}</p>
        <div class="flex items-center gap-2 mb-4">
            <div class="rating rating-xs">
                ${generateRatingStars(product.rating.rate)}
            </div>
            <span class="text-sm">(${product.rating.count} reviews)</span>
        </div>
        <p class="mb-6">${product.description}</p>
        <div class="modal-action">
            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
    `;

    document.getElementById("product-modal").showModal();
};

const addToCart = (productId) => {
    cartCount++;
    document.querySelector(".cart-count").textContent = cartCount;

    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end";
    toast.innerHTML = `
        <div class="alert alert-success">
            <span>Product added to cart!</span>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
};

const setupAllProductsButton = () => {
    const allBtn = document.querySelector('[data-category="all"]');
    allBtn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach((b) => {
            b.classList.remove("active", "btn-primary");
            b.classList.add("btn-outline");
        });
        allBtn.classList.add("active", "btn-primary");
        allBtn.classList.remove("btn-outline");

        displayProducts(products);
    });
};

const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupAllProductsButton();
    setupSmoothScroll();

    setTimeout(() => {
        const allBtn = document.querySelector('[data-category="all"]');
        if (allBtn) {
            allBtn.classList.add("active", "btn-primary");
            allBtn.classList.remove("btn-outline");
        }
    }, 100);
});

window.showProductDetails = showProductDetails;
window.addToCart = addToCart;