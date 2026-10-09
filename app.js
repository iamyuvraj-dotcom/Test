const products = [
  {id:1,name:"Everyday Ceramic Vase",category:"Home",price:38,oldPrice:null,badge:"Bestseller",color:"Chalk",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80",tone:"#ded8ca"},
  {id:2,name:"Soft Form Throw",category:"Home",price:68,oldPrice:82,badge:"A little less",color:"Oat / Moss",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",tone:"#c4c6b4"},
  {id:3,name:"Daily Carry Tote",category:"Accessories",price:32,oldPrice:null,badge:"Everyday essential",color:"Natural canvas",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",tone:"#d4c3a8"},
  {id:4,name:"Ritual Stoneware Mug",category:"Home",price:24,oldPrice:null,badge:"Small batch",color:"Warm sand",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",tone:"#c4b8a4"},
  {id:5,name:"Quiet Moment Candle",category:"Wellness",price:29,oldPrice:null,badge:"Customer favourite",color:"Cedar & fig",image:"https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",tone:"#e4d7c5"},
  {id:6,name:"Weekend Crossbody",category:"Accessories",price:54,oldPrice:null,badge:"Just landed",color:"Earth",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",tone:"#aa8c72"}
];
const state={filter:"All",query:"",sort:"featured",cart:[]};
const $=s=>document.querySelector(s);
const grid=$("#product-grid"),empty=$("#empty-state"),cartDrawer=$("#cart-drawer"),overlay=$("#overlay");
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
function renderProducts(){
 let list=products.filter(p=>(state.filter==="All"||p.category===state.filter)&&p.name.toLowerCase().includes(state.query.toLowerCase()));
 if(state.sort==="low")list.sort((a,b)=>a.price-b.price);
 if(state.sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag"><span>Quick add</span><span>＋</span></button></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.color}</p><div class="swatches" aria-label="Product tone"><i style="background:${p.tone}"></i><i style="background:#e8e3d8"></i><i style="background:#929b82"></i></div></div><div class="product-price">${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}${money(p.price)}</div></div></article>`).join("");
 empty.hidden=list.length>0;
}
function cartCount(){return state.cart.reduce((n,i)=>n+i.qty,0)}
function renderCart(){
 const count=cartCount(),items=$("#cart-items");
 $("#cart-count").textContent=count;$("#drawer-count").textContent=`(${count})`;
 items.innerHTML=state.cart.map(i=>`<div class="cart-row"><img src="${i.image}" alt=""><div><h3>${i.name}</h3><p>${i.color}</p><div class="quantity-control"><button data-qty="${i.id}" data-delta="-1" aria-label="Decrease ${i.name} quantity">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="Increase ${i.name} quantity">＋</button></div><button class="remove-item" data-remove="${i.id}">Remove</button></div><div class="cart-row-price">${money(i.price*i.qty)}</div></div>`).join("");
 const isEmpty=count===0;$("#cart-empty").hidden=!isEmpty;$("#drawer-footer").hidden=isEmpty;$("#cart-subtotal").textContent=money(state.cart.reduce((n,i)=>n+i.price*i.qty,0));
}
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function addToCart(id){const p=products.find(p=>p.id===Number(id));if(!p)return;const found=state.cart.find(i=>i.id===p.id);found?found.qty++:state.cart.push({...p,qty:1});renderCart();toast(`${p.name} added to your bag`)}
function openCart(){cartDrawer.classList.add("open");cartDrawer.inert=false;cartDrawer.setAttribute("aria-hidden","false");overlay.hidden=false;document.body.style.overflow="hidden";$("#close-cart").focus()}
function closeCart(){cartDrawer.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");cartDrawer.inert=true;overlay.hidden=true;document.body.style.overflow="";$("#open-cart").focus()}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add)});
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{state.filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderProducts()}));
document.querySelectorAll("[data-filter-link]").forEach(a=>a.addEventListener("click",()=>{
 state.filter=a.dataset.filterLink;
 document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x.dataset.filter===state.filter));
 renderProducts();
 $(".main-nav").classList.remove("open");
 $("#menu-toggle").setAttribute("aria-expanded","false");
}));
$("#product-search").addEventListener("input",e=>{state.query=e.target.value.trim();renderProducts()});
$("#sort-products").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
$("#view-all").addEventListener("click",()=>{state.filter="All";state.query="";$("#product-search").value="";document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x.dataset.filter==="All"));renderProducts()});
$("#open-cart").addEventListener("click",openCart);$("#close-cart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
$("#continue-shopping").addEventListener("click",()=>{closeCart();$("#shop").scrollIntoView({behavior:"smooth"})});
$("#cart-items").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const item=state.cart.find(i=>i.id===Number(q.dataset.qty));if(item){item.qty+=Number(q.dataset.delta);if(item.qty<=0)state.cart=state.cart.filter(i=>i.id!==item.id);renderCart()}}if(r){state.cart=state.cart.filter(i=>i.id!==Number(r.dataset.remove));renderCart()}});
$("#checkout-button").addEventListener("click",()=>toast("Demo checkout only — no payment or order has been placed."));
$("#newsletter-form").addEventListener("submit",e=>{e.preventDefault();const email=$("#newsletter-email");if(!email.checkValidity()){email.reportValidity();return}$("#newsletter-message").textContent="Thanks for your interest! This demo does not store email addresses or send discounts.";email.value=""});
$(".search-toggle").addEventListener("click",()=>{$("#search-box").scrollIntoView({behavior:"smooth",block:"center"});$("#product-search").focus()});
$("#menu-toggle").addEventListener("click",()=>{const nav=$(".main-nav"),open=nav.classList.toggle("open");$("#menu-toggle").setAttribute("aria-expanded",String(open))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&cartDrawer.classList.contains("open"))closeCart()});
cartDrawer.inert=true;
renderProducts();renderCart();
