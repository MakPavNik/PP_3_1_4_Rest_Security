$(async function () {
    await tableUsers();
    await tableUserId();
    await addNewUserForm();
    await addNewUser();
    await getDefaultModal();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findAllUsers: async () => await fetch('/api/admin/users'),
    findUser: async () => await fetch('/api/admin/user'), ////////////////
    addNewUser: async (user) => await fetch('/api/admin/user', {/////////////////////
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    showOneUser: async (id) => await fetch(`/api/admin/users/${id}`),
    deleteUser: async (id) => await fetch(`/api//admin/users/delete/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    updateUser: async (user) => await fetch('/api/admin/update/users', {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    })
}

async function tableUserId() {
    let table = $('#tableUserId');
    table.empty();

    await userFetchService.findUser()
        .then(res => res.json())
        .then(user => {
            let tablePrincipal = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name)}</td>
                </tr>            
            )`
            table.append(tablePrincipal)
        })
}

async function tableUsers() {
    const usersList = document.querySelector('#tableUsers')
    let result = ''

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => users.forEach(user => {
            result += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                        data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                        data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            `
        }))
    usersList.innerHTML = result

    $("#tableUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');
        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

const roleJson = []
        //--------Нет такого
fetch('api/roles')
    .then(res => res.json())
    .then(roles => roles.forEach(role => roleJson.push(role)))

async function addNewUser() {
    $('#addNewUserButton').click(async (e) => {
        let addUserForm = $('#addUserForm')
        let firstName = addUserForm.find('#firstNameNewUser').val().trim();
        let lastName = addUserForm.find('#lastNameNewUser').val().trim();
        let age = addUserForm.find('#ageNewUser').val().trim();
        let email = addUserForm.find('#emailNewUser').val().trim();
        let password = addUserForm.find('#passwordNewUser').val().trim();
        let rolesArray = addUserForm.find('#newRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id === rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await tableUsers()
        }
    })
}

async function addNewUserForm() {
    let form = $(`#addUserForm`)

    //-----------Нет такого
    fetch('/api/roles').then(function (response) {
        form.find('#newRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                form.find('#newRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {

        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function deleteUser(modal, id) {
    let thisUser = await userFetchService.showOneUser(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-danger" id="deleteButton" data-dismiss="modal" data-backdrop="false">Delete</button>`

    modal.find('.modal-title').html('Delete user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)

    user.then(user => {
        let bodyForm = `<form id="deleteUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">First Name</span>
                                    <input type="text" value="${user.firstName}" name="firstName" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Last Name</span>
                                    <input type="text" value="${user.lastName}" name="lastName" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Age</span>
                                    <input type="number" value="${user.age}" name="age" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="deleteRoles" size="2" readonly>`

        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#deleteRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#deleteRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $(`#deleteButton`).on('click', async () => {
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            await tableUsers()
            modal.modal('hide');
        }
    })
}

async function editUser(modal, id) {
    let thisUser = await userFetchService.showOneUser(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-primary" id="editButton" data-dismiss="modal" data-backdrop="false">Edit</button>`

    modal.find('.modal-title').html('Edit user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)

    user.then(user => {
        let bodyForm = `<form id="editUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" id="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">First Name</span>
                                    <input type="text" value="${user.firstName}" name="firstName" id="firstName" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Last Name</span>
                                    <input type="text" value="${user.name}" name="lastName" id="lastName" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Age</span>
                                    <input type="number" value="${user.age}" name="age" id="age" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" id="email" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Password</span>
                                    <input type="password" value="${user.password}" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="updateRoles" size="2">`
        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#updateRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#updateRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $("#editButton").on('click', async () => {
        let id = modal.find('#id').val()
        let firstName = modal.find('#firstName').val()
        let lastName = modal.find('#lastName').val()
        let age = modal.find('#age').val()
        let email = modal.find('#email').val()
        let password = modal.find('#password').val()
        let rolesArray = modal.find('#updateRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id === rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.updateUser(data)
        if (response.ok) {
            await tableUsers()
            modal.modal('hide')
        }
    })


}