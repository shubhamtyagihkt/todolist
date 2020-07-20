document.getElementById("nav-mylist").classList.add("active");

$(document).ready(function () {
	$("#sidebar-toggle").click(function(e) {
	    e.preventDefault();
	    $("#list-sidebar-wrapper").toggleClass("active");

	    if($("#list-sidebar-wrapper").hasClass("active")) {
			$("#list-sidebar").show();
			$("#list-sidebar").css({opacity: 1});
			$("#list-div").css({width: "60%"});
		}
		else {
			$("#list-sidebar").hide();
			$("#list-sidebar").css({opacity: 0});
			$("#list-div").css({width: "80%"});
		}
	});

	if($(window).width() < 768) {
	  $('#list-sidebar-wrapper').toggleClass('active');

		if($("#list-sidebar-wrapper").hasClass("active")) {
			$("#list-sidebar").show();
			$("#list-sidebar").css({opacity: 1});
			$("#list-div").css({width: "60%"});
		}
		else {
			$("#list-sidebar").hide();
			$("#list-sidebar").css({opacity: 0});
			$("#list-div").css({width: "80%"});
		}
	}

	getAllItems();
	console.log("Top print");
});




var newItemId = 11;
var items;

// var items = [
// 	{	"id": 1,
// 		"description": `Create a new webpage`,
// 		"status": "Pending"
// 	},
// 	{	"id": 2,
// 		"description": `Learn HTML`,
// 		"status": "Done"
// 	},
// 	{	"id": 3,
// 		"description": `Learn CSS`,
// 		"status": "Done"
// 	},
// 	{	"id": 4,
// 		"description": `Learn JavaScript`,
// 		"status": "Pending"
// 	},
// 	{	"id": 5,
// 		"description": `Learn Bla Bla`,
// 		"status": "Deleted"
// 	},
// 	{	"id": 6,
// 		"description": `Learn NodeJS`,
// 		"status": "Pending"
// 	},
// 	{
// 		"id": 7,
// 		"description": `Learn Bootstrap`,
// 		"status": "Done"
// 	}
// ];




// var items = {
// 	3: {	
// 		"id": 3,
// 		"description": `Learn CSS`,
// 		"status": "Done"
// 	},
// 	2: {	
// 		"id": 2,
// 		"description": `Learn HTML`,
// 		"status": "Done"
// 	},
// 	1: {	
// 		"id": 1,
// 		"description": `Create a new webpage`,
// 		"status": "Pending"
// 	},
// 	4: {	
// 		"id": 4,
// 		"description": `Learn JavaScript`,
// 		"status": "Pending"
// 	},
// 	5: {	
// 		"id": 5,
// 		"description": `Learn Bla Bla`,
// 		"status": "Deleted"
// 	},
// 	6: {	
// 		"id": 6,
// 		"description": `Learn NodeJS`,
// 		"status": "Pending"
// 	},
// 	7: {
// 		"id": 7,
// 		"description": `Learn Bootstrap`,
// 		"status": "Done"
// 	}
// };




function addElement() {
	var item = document.getElementById("list-new-input").value;
	newItemId = items.length + 1;
	if(item == "") {
		alert("Please write something!");
		return;
	}

	console.log(item);
	// call backend function to add in database
	addElementDB(newItemId, item, "Pending");

	addElementInList(newItemId, item, "Pending");

	var mylist = document.getElementById("list");

	var listItems = mylist.innerHTML;

	listItems += `
		<li id="`+newItemId+`">`+item+`<span class="cross"><i class="fas fa-times-circle"></i></span></li>
	`;


	mylist.innerHTML = listItems;

	document.getElementById("list-new-input").value = "";

	$("#list li").click(function(){
	  $(this).toggleClass('checked');

	  if($(this).hasClass('checked')) {
	  	markDone($(this).attr("id"));
	  }
	  else {
	  	markPending($(this).attr("id"));
	  }
	});
}




$('#list').on('click', '.cross', function() {
  markDeleted($(this).parent().attr("id"));
  $(this).parent().remove();
  //$(this).parent().fadeOut(300, function(){ $(this).remove(); });
});




function showItems(category) {
	$("#categories li").removeClass("active");

	if(category == "All") {
		showAllItems(items);
		$("#category-all").addClass("active");
	}
	else if(category == "Pending") {
		showPendingItems(items);
		$("#category-pending").addClass("active");
	}
	else if(category == "Done") {
		showDoneItems(items);
		$("#category-done").addClass("active");
	}
	else if(category == "Deleted") {
		showDeletedItems(items);
		$("#category-deleted").addClass("active");
	}
}




function showAllItems(items) {
	var l = items.length;
	
	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		addItem(item, "All");
	}

	$("#list li").click(function(){
	  $(this).toggleClass('checked');

	  if($(this).hasClass('checked')) {
	  	markDone($(this).attr("id"));
	  }
	  else {
	  	markPending($(this).attr("id"));
	  }
	});
}




function showPendingItems(items) {
	var l = items.length;

	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		if(item.status == "Pending")
			addItem(item, "Pending");
	}

	$("#list li").click(function(){
	  $(this).toggleClass('checked');

	  if($(this).hasClass('checked')) {
	  	markDone($(this).attr("id"));
	  }
	  else {
	  	markPending($(this).attr("id"));
	  }
	});
}




function showDoneItems(items) {
	var l = items.length;

	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		if(item.status == "Done")
			addItem(item, "Done");
	}

	$("#list li").click(function(){
	  $(this).toggleClass('checked');

	  if($(this).hasClass('checked')) {
	  	markDone($(this).attr("id"));
	  }
	  else {
	  	markPending($(this).attr("id"));
	  }
	});
}




function showDeletedItems(items) {
	var l = items.length;

	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		if(item.status == "Deleted")
			addItem(item, "Deleted");
	}
}




function addItem(item, category) {
	if(!item) {
		return;
	}

	var mylist = document.getElementById("list");

	var listItems = mylist.innerHTML;

	if(item.status == "Done") {
		listItems += `
			<li id="`+item.id+`" class="checked">`+item.description+`<span class="cross"><i class="fas fa-times-circle"></i></span></li>
		`;
	}
	else if(item.status == "Pending") {
		listItems += `
			<li id="`+item.id+`">`+item.description+`<span class="cross"><i class="fas fa-times-circle"></i></span></li>
		`;
	}
	else if(item.status == "Deleted" && category == "Deleted") {
		listItems += `
			<li id="`+item.id+`">`+item.description+`</li>
		`;
	}

	mylist.innerHTML = listItems;
}




function markDone(id) {
	//call backend function to set status as Done

	changeStatus(id, "Done");

	items[id-1].status = "Done";
}

function markPending(id) {
	//call backend function to set status as Pending

	changeStatus(id, "Pending");

	items[id-1].status = "Pending";
}

function markDeleted(id) {
	//call backend function to set status as Deleted

	changeStatus(id, "Deleted");

	items[id-1].status = "Deleted";
}

function addElementInList(id, description, status) {
	items[id-1] = {
		"id": id,
		"description": description,
		"status": status
	}
}




function getAllItems() {
	//Getting all items from backend/database via an API call

	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({}),
		url: "http://localhost:3000/backend/getItems",
		success: function(response) {
			if(response.status == "success") {
				// console.log(response.status);
				// console.log(response.items);
				console.log("Bottom print");
				items = response.items;
				showAllItems(items);
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}




function changeStatus(myid, mystatus) {
	//Changing status of an item via an API call

	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"id": myid, "status": mystatus}),
		url: "http://localhost:3000/backend/changeStatus",
		success: function(response) {
			if(response.status == "success") {
				
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}

function addElementDB(id, desc, status) {
	//Changing status of an item via an API call

	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"id": id, "description": desc, "status": status}),
		url: "http://localhost:3000/backend/addElement",
		success: function(response) {
			if(response.status == "success") {
				
			}
			else {
				console.log(response);
			}
		},
		error: function(xhr, status, err) {
			console.log(err.toString());
		}
	});
}