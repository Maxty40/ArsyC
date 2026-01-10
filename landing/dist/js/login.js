//validasi login
const form = document.getElementById("loginValidation");
const username = document.getElementById("username");
const password = document.getElementById("password");

const errUser = document.getElementById("errUser");
const errPass = document.getElementById("errPass");

const user = [
    { username: "user1", password: "user123", role: "user"},
    { username: "admin1", password: "admin123", role: "admin"}
];

form.addEventListener("submit", function(x)
{
    x.preventDefault();

    errUser.innerHTML = "";
    errPass.innerHTML = "";

    let valid = true;

    if (username.value.trim() === "")
    {
        errUser.innerHTML = `<p class="text-red-500 text-sm mt-1">Username Tidak Boleh Kosong</p>`;
        valid = false;
    }

    if (password.value.trim() === "")
    {
        errPass.innerHTML = `<p class="text-red-500 text-sm mt-1">Password Tidak Boleh Kosong</p>`;
        valid = false;
    } else if (password.value.length < 6 )
    {
        errPass.innerHTML = `<p class="text-red-500 text-sm mt-1">Password Harus Lebih dari 6 Karakter</p>`;
        valid  = false;
    }
    
    if (!valid) return;

    const foundUser = user.find(
        u => u.username === username.value && u.password === password.value
    );

    if (!foundUser) {
        errPass.innerHTML = `<p class="text-red-500 text-sm mt-1">Username atau Password Salah</p>`;
        return;
    }

    alert(`Login Berhasil Sebagai ${foundUser.role}`);

    localStorage.setItem("loginUser", JSON.stringify(foundUser));

    if (foundUser.role === "admin") {
        window.location.href = "../../admin/dist/dashboard.html";
    } else {
        window.location.href = "user.html";
    }
});