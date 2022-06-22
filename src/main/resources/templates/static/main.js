let userInfo = $('#tableUsers')
let getAllUser = []
const xhr = new XMLHttpRequest();

getUsers()

function getUsers() {
    fetch("/api/admin/users").then((response) => {
        response.json().then((users) => {
            users.forEach((user) => {
                addUserForTable(user)
                getAllUser.push(user)
            });
        });
    });
}

function addUserForTable(user) {
    userInfo.append(
        '<tr>' +
        '<td>' + user.id + '</td>' +
        '<td>' + user.firstName + '</td>' +
        '<td>' + user.lastName + '</td>' +
        '<td>' + user.age + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.roles.map(roleUser => roleUser.role) + '</td>' +
        '<td>' +
        '<button onclick="editUserById(' + user.id + ')" class="btn btn-info edit-btn" data-toggle="modal" data-target="#edit"' +
        '>Edit</button></td>' +
        '<td>' +
        '<button onclick="deleteUserById(' + user.id + ')" class="btn btn-danger edit-btn" data-toggle="modal" data-target="#delete"' +
        '>Delete</button></td>' +
        '</tr>'
    )
}

const addUserForm = document.querySelector('.add-user-form')
addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch("api/admin/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('newFirstName').value,
            surName: document.getElementById('newLastName').value,
            age: document.getElementById('newAge').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            roles: getRole(Array.from(document.getElementById('newRole').selectedOptions).map(role => role.value))
        })
    })
        .then(() => {
            document.getElementById('newFirstName').value = ''
            document.getElementById('newLastName').value = ''
            document.getElementById('newAge').value = ''
            document.getElementById('newEmail').value = ''
            document.getElementById('newPassword').value = ''
            document.getElementById('newRole').value = ''
            getUsers();
            document.getElementById("newUserForm").reset();
            document.location.replace('/admin/users')
        })
})


function deleteUserById(id) {

    fetch("api/admin/users/" + id, {
        method: "GET",
        dataType: 'json'
    })
        .then(res => {
            res.json().then(user => {
                $("#deleteId").val(user.id);
                $("#deleteFirstName").val(user.firstName);
                $("#deleteLastName").val(user.lastName);
                $("#deleteAge").val(user.age);
                $("#deleteEmail").val(user.email);
                user.roles.map(role => {
                    $("#deleteRole").append('<option>' + role.role + '</option>')
                })
            })
        })
}

function deleteItem() {
    fetch("api/admin/users/" + ($("#deleteId").val()), {
        method: "DELETE",
    })
        .then(() => {
            location.reload();
            closeForm();
            userInfo().empty();
            getUsers();
        })
}

function closeForm() {
    $("#edit .close").click();
    document.getElementById("editUserForm").reset();
    $("#delete .close").click();
    document.getElementById("deleteUserForm").reset();
    $('#deleteRole > option').remove();
}

function editUserById(id) {
    fetch("api/users/" + id, {
        method: "GET",
        dataType: 'json'
    })
        .then(res => {
            res.json().then(user => {
                $("#editId").val(user.id);
                $("#editName").val(user.name);
                $("#editSurName").val(user.surName);
                $("#editAge").val(user.age);
                $("#editEmail").val(user.email);
                $("#editPassword").val(user.password);
            })
        })
}

function updateItem() {
    let id = document.getElementById('editId').value;
    let name = document.getElementById('editName').value;
    let surName = document.getElementById('editSurName').value;
    let age = document.getElementById('editAge').value;
    let email = document.getElementById('editEmail').value;
    let password = document.getElementById('editPassword').value;
    let roles = getRole(Array.from(document.getElementById('editRole').selectedOptions).map(role => role.value));

    fetch("api/users/" /*+ id*/, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            surName: surName,
            age: age,
            email: email,
            password: password,
            roles: roles
        })
    })
        .then(() => {
            userInfo.empty();
            getUsers();
            closeForm();
        })
}

function getRole(list) {
    let roles = [];
    if (list.indexOf("ADMIN") >= 0) {
        roles.push({"id": 1});
    }
    if (list.indexOf("USER") >= 0) {
        roles.push({"id": 2});
    }
    return roles;
}