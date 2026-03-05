const toggleSpinner = (isLoading)=>{
  const spinner = document.getElementById('loadingSpinner')
  if(isLoading == true){
    spinner.classList.remove('hidden')
  }
  else{
    spinner.classList.add('hidden')
  }
}

const categories = ()=>{
  const url1= 'https://openapi.programming-hero.com/api/categories'
  fetch(url1)
  .then(res=> res.json())
  .then(data=> loadCategories(data.categories))
}

const loadTrees = ()=>{
  const url2= 'https://openapi.programming-hero.com/api/plants'
  fetch(url2)
  .then(res=> res.json())
  .then(data=> displayTrees(data.plants))
}

const displayTrees =(trees)=>{
const treesContainer = document.getElementById('treesContainer')
for(const tree of trees){
  const card = document.createElement('div')
  card.innerHTML = `
    <div class="card bg-white shadow-sm">
      <figure class="w-40 h-40">
          <img src="${tree.image}" alt="">
      </figure>
      <div class="card-body">
          <h2 class="card-title">${tree.name}</h2>
          <p class="line-clamp-2">
          ${tree.description}
          </p>
          <div class="badge badge-success badge-outline">
          ${tree.category}
          </div>
      <div class="flex justify-between items-center">
              <h2 class="font-bold text-xl text-[#4ade80]">${tree.price}</h2>
              <button class="btn btn-primary px-3 ">Cart</button>
          </div>
      </div>
    </div>
  `
  treesContainer.appendChild(card)
}
}
loadTrees()

const loadCategories = (category)=>{
  const categoriesContainer = document.getElementById('categoriesContainer')
  for(const btns of category){
    const btn = document.createElement('div')
    btn.innerHTML = `
    <button class="btn w-61">${btns.category_name}</button>
    `
    categoriesContainer.appendChild(btn)
  }
}
categories()
