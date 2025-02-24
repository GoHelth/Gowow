document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.btn-login');
    const darkModeToggle = document.createElement('button');

    // ✅ إعداد زر تفعيل الوضع الداكن
    darkModeToggle.classList.add('toggle-dark-mode');
    darkModeToggle.textContent = '🌙 الوضع الليلي';
    document.querySelector('header').appendChild(darkModeToggle);

    // ✅ التبديل بين الوضع الفاتح والداكن
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️ الوضع الفاتح';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = '🌙 الوضع الليلي';
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // ✅ تحميل تفضيلات الوضع الليلي عند فتح الصفحة
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ الوضع الفاتح';
    }

    // ✅ إضافة تفاعل لزر تسجيل الدخول
    loginBtn.addEventListener('click', () => {
        window.location.href = '/login.html';
    });
});
