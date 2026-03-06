const cartContainer = document.getElementById("cartContainer");
const totalPriceElement = document.getElementById("totalPrice");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const treeDetailsModal = document.getElementById("tree-details-modal");
let cart = [];
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('userName').value;
        const phone = document.getElementById('userPhone').value;
        const email = document.getElementById('userEmail').value;

        document.getElementById('signup_modal').close();


        Swal.fire({
            title: 'Congratulations!',
            html: `<b>${name}</b>, your account has been created successfully.<br>Welcome to the Green Earth family!`,
            icon: 'success',
            iconColor: '#15803D',
            confirmButtonText: 'Let\'s Start',
            confirmButtonColor: '#15803D',
            background: '#f0fff4',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        signupForm.reset();
    });
}

const toggleSpinner = (isLoading) => {
    const spinner = document.getElementById('loadingSpinner');
    const treesContainer = document.getElementById('treesContainer');
    if (isLoading) {
        spinner.classList.remove('hidden');
        treesContainer.innerHTML = "";
    } else {
        spinner.classList.add('hidden');
    }
}

const categories = () => {
    const url1 = 'https://openapi.programming-hero.com/api/categories';
    fetch(url1)
        .then(res => res.json())
        .then(data => loadCategories(data.categories));
}

async function selectCategory(categoryId, btn) {
    toggleSpinner(true);

    const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesbtn");
    allButtons.forEach((b) => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
    });

    const clickedBtn = btn.querySelector('button') || btn;
    clickedBtn.classList.add('btn-primary');
    clickedBtn.classList.remove('btn-outline');

    const url3 = `https://openapi.programming-hero.com/api/category/${categoryId}`;
    fetch(url3)
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                displayTrees(data.plants || data.data || []);
                toggleSpinner(false);
            }, 500);
        });
}

const allTreesBtnElement = document.getElementById('allTreesbtn');
allTreesBtnElement.addEventListener("click", () => {
    const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesbtn");
    allButtons.forEach((btn) => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });

    allTreesBtnElement.classList.add('btn-primary');
    allTreesBtnElement.classList.remove('btn-outline');

    loadTrees();
});

const loadTrees = () => {
    const url2 = 'https://openapi.programming-hero.com/api/plants';
    toggleSpinner(true);
    fetch(url2)
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                displayTrees(data.plants);
                toggleSpinner(false);
            }, 1000);
        });
}

const displayTrees = (trees) => {
    const treesContainer = document.getElementById('treesContainer');
    treesContainer.innerHTML = "";

    if (trees.length === 0) {
        treesContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">No trees found in this category.</p>`;
        return;
    }

    for (const tree of trees) {
        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm border-b-2 ${tree.price > 500 ? "border-red-500" : "border-green-500"}`;
        card.innerHTML = `
      <figure class="w-full h-48">
          <img src="${tree.image}" class="w-full h-full object-cover cursor-pointer" onclick="openTreeModal(${tree.id})" alt="${tree.name}">
      </figure>
      <div class="card-body">
          <h2 class="card-title cursor-pointer hover:text-green-600" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
          <p class="line-clamp-2 text-sm text-gray-600">${tree.description}</p>
          <div class="badge badge-success badge-outline">${tree.category}</div>
          <div class="flex justify-between items-center mt-2">
              <h2 class="font-bold text-xl text-[#4ade80]">$${tree.price}</h2>
              <button class="btn btn-primary btn-sm" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})">Cart</button>
          </div>
      </div>
    `;
        treesContainer.appendChild(card);
    }
}

async function openTreeModal(treeId) {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
    const data = await res.json();
    const plant = data.plants;

    document.getElementById("modalTitle").textContent = plant.name;
    document.getElementById("modalImage").src = plant.image;
    document.getElementById("modalCategory").textContent = plant.category;
    document.getElementById("modalDescription").textContent = plant.description;
    document.getElementById("modalPrice").textContent = plant.price;

    treeDetailsModal.showModal();
}

function addToCart(id, name, price) {
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove("hidden");
        totalPriceElement.textContent = `$0`;
        return;
    }

    emptyCartMessage.classList.add("hidden");

    cart.forEach((item) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.className = "card card-body bg-slate-100 p-4 mb-2 shadow-sm";
        cartItem.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="font-bold">${item.name}</h2>
                    <p class="text-sm">$${item.price} × ${item.quantity}</p>
                </div>
                <button class="btn btn-xs btn-circle btn-ghost text-red-500" onclick="removeFromCart(${item.id})">✕</button>
            </div>
            <p class="text-right font-semibold">$${item.price * item.quantity}</p>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalPriceElement.innerText = `$${total}`;
}

function removeFromCart(treeId) {
    cart = cart.filter((item) => item.id !== treeId);
    updateCart();
}

const loadCategories = (category) => {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = "";
    for (const btns of category) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `<button class="btn btn-outline w-full">${btns.category_name}</button>`;
        btnDiv.onclick = () => selectCategory(btns.id, btnDiv);
        categoriesContainer.appendChild(btnDiv);
    }
}
categories();
loadTrees();