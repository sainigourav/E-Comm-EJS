// ------------function to add name on the page------------

var req = new XMLHttpRequest();
req.open("GET","/profile");
req.send();
req.addEventListener("load",function(event){
  var out = event.target.responseText;
  document.getElementById("name").innerHTML = "Welcome "+ (out).toUpperCase()+" !";
})

var req = new XMLHttpRequest();
req.open("GET","/p_pic");
req.send();
req.addEventListener("load",function(event){
  var out = event.target.responseText;
  console.log(out);
  document.getElementById("p_pic").style.backgroundImage = "url("+out+")";
})

var success = document.getElementById("add_success");
var logout = document.getElementById("logout");
const loader = document.getElementById("loader-container");
	const toggleLoader = (val)=>{
		if(val == true){
			loader.style.display = 'block';
		}else if(val == false){
			loader.style.display = 'none';
		}
	}
	        toggleLoader(true);
  window.onload = function(){ toggleLoader(false); }
  

// --------------------------Add to Cart-----------------------

this.addEventListener("click",function(event){
    if(event.target.id === "cart_btn")
    {
        
        toggleLoader(true);
        success.style.display = "block";
        var top = ((((event.target.parentNode).parentNode).parentNode).parentNode);
        var time_Id = setTimeout(function(){
        var request = new XMLHttpRequest();    
  request.open("GET","/CartItem.txt");
  request.send();
  request.addEventListener("load", function(event)
  {
    var output = JSON.parse(event.target.responseText);
    if (output === null) return;
    output.forEach(function(item)
        {
           if(item.id == top.id)
           {console.log(item);
           
                var request = new XMLHttpRequest();
                request.open("POST","/emailcart");
                request.setRequestHeader("Content-type","application/json");
                var newCart = {
                    id : item.id,
                    itemName : item.itemName,
                    rupees : item.rupees,
                    source : item.source,
                    descr : item.descr,
                    quantity : 1
                }
                request.send(JSON.stringify(newCart));
           }
            
        })
    })
        success.style.display = "none";
        toggleLoader(false);
        },1000)

}
})

// -----------function for logout the user-------------
logout.addEventListener("click",function(event){
  var request = new XMLHttpRequest();
  request.open("GET","/logout");
  request.send();
  window.location.replace("/");
})
