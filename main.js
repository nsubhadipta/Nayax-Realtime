var config = {
    apiKey: "********************************",
    authDomain: "***************************",
    databaseURL: "************************************",
    projectId: "***********",
    storageBucket: "*************************",
    messagingSenderId: "********",
    appId: "***************************"
    };
    firebase.initializeApp(config);

///////////Write=True
    // Reference messages collection
    var messagesRef = firebase.database().ref('contactformmessages');

    $('#contactForm').submit(function(e) {
        e.preventDefault();
    
        var newMessageRef = messagesRef.push();
        newMessageRef.set({
            name: $('.fullname').val(),
            email: $('.email').val(),
            subject: $('.subject').val(),
            message: $('.message').val()
        });
    
        $('.success-message').show();
    
        $('#contactForm')[0].reset();
    });

////////////Read=True


    //Data Object Change Listener.child('object')
    const preObject = document.getElementById('object');
    const dbRefObject = firebase.database().ref();

    dbRefObject.on('value', snap => {

    //   console.log(snap.val());  
    //   console.log(snap.val().person.place); 
      console.log(snap.val());   
      preObject.innerText = JSON.stringify(snap.val().contactformmessages, null, 3);

    }, function(error) {
      // The fetch failed.
      console.error(error);
    });




    /////////////Read Format Wise


    const dbRef = firebase.database().ref();
    const contactRef = dbRef.child('contactformmessages');


    readContactData(); 
    
    function readContactData() {

        const contactListUI = document.getElementById("contact-list");
    
        contactRef.on("value", snap => {
    
            contactListUI.innerHTML = ""
    
            snap.forEach(childSnap => {
    
                let key = childSnap.key,
                    value = childSnap.val()
                  
                let $li = document.createElement("li");
    
               // delete icon
                let deleteIconUI = document.createElement("span");
                deleteIconUI.class = "delete-contact";
                deleteIconUI.innerHTML = " ☓";
                deleteIconUI.setAttribute("contactid", key);
                deleteIconUI.addEventListener("click", deleteButtonClicked)

                // edit icon
                let editIconUI = document.createElement("span");
                editIconUI.class = "edit-contact";
                editIconUI.innerHTML = " ✎";
                editIconUI.setAttribute("contactid", key);
                editIconUI.addEventListener("click", editButtonClicked)
                
                
                
                $li.innerHTML = value.name;
                $li.append(deleteIconUI);
                $li.append(editIconUI);
                
                
    
                $li.setAttribute("contact-key", key);
                $li.addEventListener("click", contactClicked)
                contactListUI.append($li);
    
             });
    
    
        })
    
    }

    
    function contactClicked(e) {


        var contactID = e.target.getAttribute("contact-key");

        const contactRef = dbRef.child('contactformmessages/' + contactID);
        const contactDetailUI = document.getElementById("contact-detail");

        contactRef.on("value", snap => {

            contactDetailUI.innerHTML = ""

            snap.forEach(childSnap => {
                var $p = document.createElement("p");
                $p.innerHTML = childSnap.key  + " - " +  childSnap.val();
                contactDetailUI.append($p);
            })

        });


    }


    // --------------------------
    // DELETE
    // --------------------------
    function deleteButtonClicked(e) {

        e.stopPropagation();

        var contactID = e.target.getAttribute("contactid");

        const contactRef = dbRef.child('contactformmessages/' + contactID);
        
        contactRef.remove();

    }








    
// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
	
	document.getElementById('edit-contact-module').style.display = "block";

	//set contact id to the hidden input field
	document.querySelector(".edit-contactid").value = e.target.getAttribute("contactid");

	const contactRef = dbRef.child('contactformmessages/' + e.target.getAttribute("contactid"));

	// set data to the contact field
	const editContactInputsUI = document.querySelectorAll(".edit-contact-input");


	contactRef.on("value", snap => {

		for(var i = 0, len = editContactInputsUI.length; i < len; i++) {

			var key = editContactInputsUI[i].getAttribute("data-key");
					editContactInputsUI[i].value = snap.val()[key];
		}

	});




	const saveBtn = document.querySelector("#edit-contact-btn");
	saveBtn.addEventListener("click", saveContactBtnClicked)
}


function saveContactBtnClicked(e) {
 
	const contactID = document.querySelector(".edit-contactid").value;
	const contactRef = dbRef.child('contactformmessages/' + contactID);

	var editedContactObject = {}

	const editContactInputsUI = document.querySelectorAll(".edit-contact-input");

	editContactInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
  		editedContactObject[textField.getAttribute("data-key")] = textField.value
	});



	contactRef.update(editedContactObject);

	document.getElementById('edit-contact-module').style.display = "none";


}
