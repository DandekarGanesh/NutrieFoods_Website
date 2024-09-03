// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()










  // JS for search box on main page
  let openSearchBox = () => {

      let leftNav = document.querySelector('.nav-left')
      let rightNav = document.querySelector('.nav-right');
      let nav = document.getElementById("navigation-bar");
      nav.innerHTML = "";
      nav.innerHTML = `<input id='input-search' oninput='displaySearchedProducts()' class="search-product-box" type='text' placeholder='Search'>  <span id='close-search' class="pointer"> &times; </span>`;

     const closeSearch = document.getElementById("close-search");
     
     // close input field
     closeSearch.addEventListener('click', (req,res) => {          
        nav.innerHTML = "";
        nav.innerHTML = `<div class='nav-left'> ${leftNav.innerHTML} </div>`;
        nav.innerHTML += `<div class='nav-right'> ${rightNav.innerHTML} </div>`;
        document.getElementById('searchedProducts').innerHTML = "";
     });
}






// call to add to cart 
async function add_to_cart(id) {
    await axios({
        method: 'post',
        url: "/add-to-cart",
        headers: {}, 
        data: {
            productId: id, // This is the body part
        }})
        .then(() => {
  
          let span = document.querySelector(".cart-item-number");
          span.innerHTML = `${parseInt(span.innerHTML) + 1}`;
        })
        .catch((err) => console.log(err));
}

