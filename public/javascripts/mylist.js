$(document).ready(function () {
	document.getElementById("nav-mylist").classList.add("active");

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

	showItems("All");
});




function allowChange() {
	$('#list').off('click', '.cross').on('click', '.cross', function(e) {
		// console.log("Cross");
	  	markDeleted($(this).parent().attr("id"));
	  	return false;
	});

	$('#list').off('click', '.edit').on('click', '.edit', function(e) {
		// console.log("Edit");
		var item = $(this).parent();
	  	var contentChild = item.children(".content");
	  	var content = contentChild.html();
	  	item.toggleClass("allowChange");
	  	item.toggleClass("allowEdit");
	  	item.html(`<input data-original="`+content+`" class="edit-input" type="text" value="`+content+`" /><span class="edit-tick"><i class="fas fa-check"></i></span><span class="edit-cross"><i class="fas fa-times"></i></span>`);
	  	return false;
	});	

	$("#list").off("click", ".allowChange").on("click", ".allowChange", function(){
		// console.log("Toggle");
		$(this).toggleClass('checked');

		if($(this).hasClass('checked')) {
			markDone($(this).attr("id"));
		}
		else {
			markPending($(this).attr("id"));
		}
		return false;
	});

	$('#list').off('click', '.edit-tick').on('click', '.edit-tick', function(e) {
		// console.log("Tick");
	  	var item = $(this).parent();
	  	editItem(item);
	  	return false;
	});

	$('#list').off('click', '.edit-cross').on('click', '.edit-cross', function(e) {
		// console.log("Cancel");
		var item = $(this).parent();
	  	var contentChild = item.children(".edit-input");
	  	var content = contentChild.attr("data-original");
	  	item.toggleClass("allowChange");
	  	item.toggleClass("allowEdit");
	  	item.html(`<span class="content">`+content+`</span><span class="edit"><i class="fas fa-edit"></i></span><span class="cross"><i class="fas fa-times-circle"></i></span>`);
	  	return false;
	});
}




function showItems(category) {
	$("#categories li").removeClass("active");
	$("#list").hide();
	$("#addNew").hide();
	$("#loader").show();

	if(category == "All") {
		getAllItems();
	}
	else {
		getCategoryItems(category);
	}
}


function showAllItems(items) {
	var l = items.length;

	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		addItem(item, "All");
	}

	allowChange();

	$("#category-all").addClass("active");
	$("#list").show();
	$("#loader").hide();
	$("#addNew").show();
}


function showCategoryItems(items, category) {
	var l = items.length;

	document.getElementById("list").innerHTML = "";

	for(var i = 0; i < l; i++) {
		var item = items[i];

		if(item.status == category)
			addItem(item, category);
	}

	if(category == "Pending") {
		$("#category-pending").addClass("active");
		allowChange();
	}
	else if(category == "Done") {
		$("#category-done").addClass("active");
		allowChange();
	}
	else if(category == "Deleted") {
		$("#category-deleted").addClass("active");
	}

	$("#list").show();
	$("#loader").hide();
}


function addItem(item, category) {
	if(!item) {
		return;
	}

	var mylist = document.getElementById("list");

	var listItems = mylist.innerHTML;

	if(item.status == "Done") {
		listItems += `
			<li class="allowChange checked" id="`+item.id+`"><span class="content">`+item.description+`</span><span class="edit"><i class="fas fa-edit"></i></span><span class="cross"><i class="fas fa-times-circle"></i></span></li>
		`;
	}
	else if(item.status == "Pending") {
		listItems += `
			<li class="allowChange" id="`+item.id+`"><span class="content">`+item.description+`</span><span class="edit"><i class="fas fa-edit"></i></span><span class="cross"><i class="fas fa-times-circle"></i></span></li>
		`;
	}
	else if(item.status == "Deleted" && category == "Deleted") {
		listItems += `
			<li id="`+item.id+`"><span class="content">`+item.description+`</span></li>
		`;
	}

	mylist.innerHTML = listItems;
}




function markDone(id) {
	changeStatus(id, "Done");
}


function markPending(id) {
	changeStatus(id, "Pending");
}


function markDeleted(id) {
	changeStatus(id, "Deleted");
}




function addElement() {
	var itemValue = document.getElementById("list-new-input").value;

	if(!itemValue) {
		alert("Please write something!");
		return;
	}

	addElementBackend(itemValue, "Pending");
}




function getAllItems() {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({}),
		url: "/backend/getItems",
		success: function(response) {
			if(response.status == "success") {
				showAllItems(response.items);
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




function getCategoryItems(category) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"status": category}),
		url: "/backend/getCategoryItems",
		success: function(response) {
			if(response.status == "success") {
				showCategoryItems(response.items, category);
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
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"id": myid, "status": mystatus}),
		url: "/backend/changeStatus",
		success: function(response) {
			if(response.status == "success") {
				if(mystatus == "Deleted") {
					$("#"+myid).remove();
				}
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




function addElementBackend(mydescription, mystatus) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"description": mydescription, "status": mystatus}),
		url: "/backend/addElementBackend",
		success: function(response) {
			if(response.status == "success") {
				showItems("All");

				document.getElementById("list-new-input").value = "";
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




function editItem(item) {
	var description = item.children(".edit-input").val();
	var id = item.attr("id");
	console.log(id);
	if(!description) {
		alert("Please write something!");
		return;
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"description": description, "id": id}),
		url: "/backend/editItem",
		success: function(response) {
			if(response.status == "success") {
				item.toggleClass("allowChange");
				item.toggleClass("allowEdit");
				item.html(`<span class="content">`+description+`</span><span class="edit"><i class="fas fa-edit"></i></span><span class="cross"><i class="fas fa-times-circle"></i></span>`);
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