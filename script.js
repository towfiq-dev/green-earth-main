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
async function selectCategory(categoryId, btn){
  console.log(categoryId, btn)
  //showLoading()
 
  const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesbtn")
  allButtons.forEach((btn)=>{
    btn.classList.remove('btn-primary')
    btn.classList.add('btn-outline')
  })
  btn.classList.add('btn-primary')
  btn.classList.remove('btn-primary')
  const url3= `https://openapi.programming-hero.com/api/category/${categoryId}`
  fetch(url3)
  .then(res=> res.json())
  .then(data=> displayTrees(data.data || data.plants || data.category))
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

const loadTrees = ()=>{
  const url2= 'https://openapi.programming-hero.com/api/plants'
  toggleSpinner(true)
  fetch(url2)
  .then(res=> res.json())
  .then(data=> 
    setTimeout(()=>{
      displayTrees(data.plants)
    toggleSpinner(false)
    }, 1000)
  )}

const displayTrees =(trees)=>{
const treesContainer = document.getElementById('treesContainer')
treesContainer.innerHTML = ""
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
  categoriesContainer.innerHTML = ""
  for(const btns of category){
    const btn = document.createElement('div')
    btn.innerHTML = `
    <button class="btn w-61">${btns.category_name}</button>
    `
    btn.onclick =()=>selectCategory(btns.id, btn)
    categoriesContainer.appendChild(btn)
  }
}
categories()
