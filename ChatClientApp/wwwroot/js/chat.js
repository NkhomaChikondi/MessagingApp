"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
var activeUsers = [];
var currentUserName = ""
var messages = []




//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

var joinGroupButton = document.getElementById("joinGroup").addEventListener("click", function (event) {

    //get the username that has been typed by the user

    let username = document.getElementById("userInput").value;

    if (username === "") {
        return alert("Please enter your name in the username field")
    } else {
        connection.invoke("JoinGroup", username)

        currentUserName = username
    }
})


connection.on("UserJoinedGroup", function (username, connectionId) {
   
    //add user to the list of actives users
    activeUsers.push({ username: username, connectionId: connectionId })
    let li = document.createElement("li");
    document.getElementById("usersList").appendChild(li);
    li.textContent = `${username}`;

    //increment users count

    let activeUsersCount = document.getElementById("activeUsersCount")

    activeUsersCount.innerHTML = activeUsers.length

    //hide the join group form

    document.getElementById("joinGroupForm").style.display = "none"

})

connection.on("ReceiveMessage", function (message, connectionId,username) {

    //add user to the list of actives users
    //activeUsers.push({ username: username, connectionId: connectionId })
    messages.push({ username: username, connectionId: connectionId, message: message })

    let li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.style.listStyle = "none";
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.innerHTML = `<span style="color:red;"><strong>${username}: </strong></span> ${message}`;

    console.log(messages)
})

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {

    let user = document.getElementById("userInput").value;

    let message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", currentUserName, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

