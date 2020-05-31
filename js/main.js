var toastSpecificEl = null;
var toastIsVisible = false;
function toast(txt, cls = ""){
	if(toastIsVisible){
		document.body.removeChild(toastSpecificEl);
		toastSpecificEl = null;
		toastIsVisible = false;
	}
	toastIsVisible = true;
	toastSpecificEl = document.createElement('div');
	if(cls != ""){
		toastSpecificEl.classList = "toast " + cls;
	}else{
		toastSpecificEl.classList = "toast";
	}	
	toastSpecificEl.innerHTML = txt;
	document.body.appendChild(toastSpecificEl);
	setTimeout(function(){
		document.body.removeChild(toastSpecificEl);
		toastSpecificEl = null;
		toastIsVisible = false;
	}, 3000);
}

var sideMenu = $('.side-menu-wrapper');
var menu = $('.side-menu', sideMenu);
function $(e, p = document){
	return p.querySelector(e);
}
$('.navbar .fa-bars').onclick = function(){
	sideMenu.classList = "side-menu-wrapper active";
}
sideMenu.onclick = function(){
	this.classList = "side-menu-wrapper";
}



var endpoint = document.getElementById('endpoint')
var path = document.getElementById('path')
var reqType = document.getElementById('reqType')
var headers = document.getElementById('headers')
var body = document.getElementById('body')
var submitBtn = document.getElementById('submitBtn')
var resContainer = document.getElementById('res')
var saveBtn = document.getElementById('saveBtn')
var prevEndPoints = []



function deleteLastItem(){
	var els = menu.querySelectorAll('.nav-item')
	menu.removeChild(els[els.length - 1])
}

function populateMenu(v){
	menu.innerHTML = '<a href="#" class="nav-item" onclick="changeVal(\'' +  v + '\')"><i class="fas fa-history"></i><span>' + v  + '</span></a>' + menu.innerHTML
}

function changeVal(v){
	endpoint.value = v
}



var d = localStorage.getItem('prevEndPoints')
if(d){
	prevEndPoints = JSON.parse(d).endPoints
	for(var i = 0; i < prevEndPoints.length; i++){
		populateMenu(prevEndPoints[i])
	}
	endpoint.value = prevEndPoints[prevEndPoints.length - 1]
}

function submit(){
	if(!endpoint.value.trim()){
		return
	}
	resContainer.style.display = "block"
	resContainer.innerText = "Loading ..."
	var $headers = {}
	var $body = {}
	
	try{
		$headers = JSON.parse(headers.value)
	}catch(e){
		toast(e)
		resContainer.style.display = "none"
	}
	try{
		$body = JSON.parse(body.value)
	}catch(e){
		toast(e)
		resContainer.style.display = "none"
	}
	var ev = endpoint.value
	if(ev.indexOf('://') < 0 && ev.trim() != ""){
		ev = "http://" + ev
	}
	var api = axios.create({
		baseURL: ev,
		timeout: 3000,
		headers: $headers
	})
	
	api[reqType.value](path.value, $body).then(function(res){
		resContainer.innerText = JSON.stringify(res.data).replace(/:/g, ": ").replace(/,/g, ", ")
	}).catch(function(e){
		toast(e)
		resContainer.style.display = "none"
	})
}


saveBtn.addEventListener('click', function(){
	if(!endpoint.value.trim()){
		return
	}
	if(prevEndPoints.indexOf(endpoint.value) < 0){
		this.innerText = "saved!"
		prevEndPoints.push(endpoint.value)
		if(prevEndPoints.length > 10){
			prevEndPoints.shift()
			deleteLastItem()
		}
		localStorage.setItem('prevEndPoints', JSON.stringify({ endPoints: prevEndPoints }))
		populateMenu(endpoint.value)
	}else{
		this.innerText = "exists!"
	}
	setTimeout(function(){
		saveBtn.innerText = "save"
	}, 2000)
})

var textareas = document.querySelectorAll('textarea')
for(var i = 0; i < textareas.length; i++){
	textareas[i].addEventListener('keydown', function(){
		this.style.height = "auto"
		this.style.height = this.scrollHeight + "px"
	})
}


submitBtn.addEventListener("click", submit)