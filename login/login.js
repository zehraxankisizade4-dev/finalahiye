document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\.).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Şifrə tələblərə uyğun deyil!");
        return;
    }

    // 1. Köhnə istifadəçiləri al 
    let users = JSON.parse(localStorage.getItem('allUsers')) || [];

    // 2. Yeni istifadəçini siyahıya əlavə et
    const newUser = { name, surname, date: new Date().toLocaleString() };
    users.push(newUser);

    // 3. Yenilənmiş siyahını yadda saxla
    localStorage.setItem('allUsers', JSON.stringify(users));
    
    // 4. Cari girişi yadda saxla
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    window.location.href = '../index.html'; 
});