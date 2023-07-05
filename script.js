const url = 'https://dummyjson.com/products?'
const limit = 10;
let skip = 0;
let totalPages;
let currentPage = 1;












const cardDiv = document.getElementById("card_div");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const currentPageSpan = document.getElementById("currentPage");
const loadingSpinner = document.getElementById("loading-spinner");






function fetchProducts() {
  setLoading(true);
  fetch(`${url}limit=${limit}&skip=${skip}`)
    .then(response => response.json())
    .then(data => {
      totalPages = Math.ceil(data.total / limit);
      updatePaginationInfo();
      displayProducts(data.products);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
      setLoading(false);
    });
}




function setLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove("hide");
    cardDiv.classList.add("hide");
  } else {
    loadingSpinner.classList.add("hide");
    cardDiv.classList.remove("hide");
  }
}




function displayProducts(products) {
  cardDiv.innerHTML = "";
  products.forEach(product => {
    const productElem = document.createElement("div");
    productElem.classList.add("product");
    const imageUrl = `https://i.dummyjson.com/data/products/${product.id}/${1}.jpg?${Date.now()}`;
    productElem.innerHTML = `
      <img src="${imageUrl}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>${product.discountPercentage ? `<p>Discount: ${product.discountPercentage}%</p>` : ""}
      <p>Price: $${product.price.toFixed(2)}</p>
      <p>Rating:${product.rating}</p>
      <p>Stock:${product.stock}</p>
      <p>Brand:${product.brand}</p>
      
      

      <button class="like-button" data-product-id="${product.id}">Like</button>
    `;
    cardDiv.appendChild(productElem);
  });




//---------------buttons-----------//



  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach(button => {
    const productId = button.dataset.productId;
    const isLiked = localStorage.getItem(`liked-${productId}`);
    if (isLiked) {
      button.classList.add("liked");
      button.textContent = "Liked";
    }
    button.addEventListener("click", () => {
      button.classList.toggle("liked");
      if (button.classList.contains("liked")) {
        button.textContent = "Liked";
        localStorage.setItem(`liked-${productId}`, true);
      } else {
        button.textContent = "Like";
        localStorage.removeItem(`liked-${productId}`);
      }
    });
  });
}




//----------pagination-------------//




function updatePaginationInfo() {
  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
  currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    skip -= limit;
    fetchProducts();
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    skip += limit;
    fetchProducts();
  }
});

fetchProducts();