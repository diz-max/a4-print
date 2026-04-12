let services = [];
let employees = [];

function initDirectories() {
    loadServices();
    loadEmployees();
    renderServices();
    renderEmployees();
}

function loadServices() {
    const saved = localStorage.getItem('a4print_services');
    services = saved ? JSON.parse(saved) : [
        { id: 1, name: "Копирование ч/б A4", price: 10 },
        { id: 2, name: "Копирование цветное A4", price: 35 },
        { id: 3, name: "Сканирование A4", price: 25 },
        { id: 4, name: "Ламинирование A4", price: 150 },
        { id: 5, name: "Печать фото 10x15", price: 35 },
        { id: 6, name: "Фото на документы", price: 350 }
    ];
}

function loadEmployees() {
    const saved = localStorage.getItem('a4print_employees');
    employees = saved ? JSON.parse(saved) : [
        { id: 1, name: "Павел", salary: 2500 },
        { id: 2, name: "Наталья", salary: 2000 },
        { id: 3, name: "Семён", salary: 2000 }
    ];
}

function saveServices() { localStorage.setItem('a4print_services', JSON.stringify(services)); }
function saveEmployees() { localStorage.setItem('a4print_employees', JSON.stringify(employees)); }

function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    container.innerHTML = '';
    services.forEach(s => {
        const div = document.createElement('div');
        div.className = 'directory-item';
        div.innerHTML = `
            <div class="directory-item-info"><strong>${s.name}</strong><br>${s.price} ₽</div>
            <div class="directory-item-actions"><button onclick="editService(${s.id})">✏️</button><button onclick="deleteService(${s.id})">🗑️</button></div>
        `;
        container.appendChild(div);
    });
}

function renderEmployees() {
    const container = document.getElementById('employeesList');
    if (!container) return;
    container.innerHTML = '';
    employees.forEach(e => {
        const div = document.createElement('div');
        div.className = 'directory-item';
        div.innerHTML = `
            <div class="directory-item-info"><strong>${e.name}</strong><br>${e.salary} ₽/смена</div>
            <div class="directory-item-actions"><button onclick="editEmployee(${e.id})">✏️</button><button onclick="deleteEmployee(${e.id})">🗑️</button></div>
        `;
        container.appendChild(div);
    });
}

function addService() {
    const name = prompt('Название услуги:');
    if (!name) return;
    const price = parseFloat(prompt('Цена:'));
    if (isNaN(price)) return;
    const newId = Math.max(...services.map(s => s.id), 0) + 1;
    services.push({ id: newId, name, price });
    saveServices();
    renderServices();
}

function addEmployee() {
    const name = prompt('Имя сотрудника:');
    if (!name) return;
    const salary = parseFloat(prompt('Оклад за смену:'));
    if (isNaN(salary)) return;
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;
    employees.push({ id: newId, name, salary });
    saveEmployees();
    renderEmployees();
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (!service) return;
    const name = prompt('Название:', service.name);
    if (name) service.name = name;
    const price = parseFloat(prompt('Цена:', service.price));
    if (!isNaN(price)) service.price = price;
    saveServices();
    renderServices();
}

function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    const name = prompt('Имя:', emp.name);
    if (name) emp.name = name;
    const salary = parseFloat(prompt('Оклад:', emp.salary));
    if (!isNaN(salary)) emp.salary = salary;
    saveEmployees();
    renderEmployees();
}

function deleteService(id) {
    if (confirm('Удалить услугу?')) {
        services = services.filter(s => s.id !== id);
        saveServices();
        renderServices();
    }
}

function deleteEmployee(id) {
    if (confirm('Удалить сотрудника?')) {
        employees = employees.filter(e => e.id !== id);
        saveEmployees();
        renderEmployees();
    }
}

function saveAllDirectories() {
    saveServices();
    saveEmployees();
    alert('✅ Все настройки сохранены!');
}

function resetToDefault() {
    if (confirm('Сбросить все настройки?')) {
        localStorage.removeItem('a4print_services');
        localStorage.removeItem('a4print_employees');
        loadServices();
        loadEmployees();
        renderServices();
        renderEmployees();
        alert('✅ Настройки сброшены!');
    }
}

initDirectories();
