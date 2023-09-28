const buttonDeleteUser = document.querySelectorAll(".buttonDelete");
const buttonChangeRoleUser = document.querySelectorAll(".buttonChangeRole");
const formsChangeRoleUser = document.querySelectorAll(".formStyleContainer");

buttonDeleteUser.forEach(button => {
    button.addEventListener("click", async () => {
        const userId = button.id;
         console.log(userId);
        const responseDeleteUser = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
        });

        const deleteUserData = await responseDeleteUser.json();
        if(deleteUserData.status === "Success"){
            alert("The user was deleted correctly");
            location.reload();
        } else {
            alert(`${deleteUserData.error}`)
        }

    })
});

buttonChangeRoleUser.forEach(button => {
    button.addEventListener("click",  () => {
        const userId = button.id.split('_')[1];
        const formContainer = document.getElementById(`formContainer_${userId}`);
        if (formContainer.style.display === 'block') {
            formContainer.style.display = 'none';
        } else {
                formContainer.style.display = 'block';
        }
        const formSelected = document.getElementById(`formChangeRole_${userId}`);
        formSelected.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dataRole = new FormData(formSelected);
            const objRole = {};
            dataRole.forEach((value, key) => (objRole[key] = value));
            if(!objRole.roleUser) return alert("Incomplete field");
            const roleSent = objRole.roleUser.toUpperCase();
            if(roleSent != "USER" && roleSent != "PREMIUM" && roleSent != "ADMIN") {
                return alert("The role entered is not include in the roles of the site")
            }
            
            const responseUser = await fetch(`/api/users/${userId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
            });
            const responseUsersData = await responseUser.json();
            const user = responseUsersData.payload;
            if(user.role.toUpperCase() === roleSent) return alert("The selected role must be different from that of the user");

            const responseChangeRole = await fetch(`/api/users/changeRoleUser/${userId}`, {
                method: "PUT",
                body: JSON.stringify(objRole),
                headers: {
                  "Content-Type": "application/json",
                },
            })

            const responseChangeRoleData = await responseChangeRole.json();
            if(responseChangeRoleData.status === "Success") {
                alert("The role was changed correctly");
                location.reload();
            } else {
                return alert(`${responseChangeRoleData.error}`)
            }
        })
    })
})

