let services = [];
let employees = [];

function initDirectories() {
    loadServices();
    loadEmployees();
    renderServices();
    renderEmployees();
}

function loadServices() {
    const saved = localStorage.getItem('photo_services');
    if (saved) {
        services = JSON.parse(saved);
    } else {
        services = [
            { id: 1, name: "Копирование ч/б A4 (1-20 шт)", price: 25 },
            { id: 2, name: "Копирование цветное A4 (1-20 шт)", price: 35 },
            { id: 3, name: "Сканирование A4", price: 25 },
            { id: 4, name: "Ламинирование A4", price: 150 },
            { id: 5, name: "Печать фото 10x15", price: 35 },
            { id: 6, name: "Фото на документы", price: 350 }
        ];
        saveServices();
    }
}

function loadEmployees() {
    const saved = localStorage.getItem('photo_employees');
    if (saved) {
        employees = JSON.parse(saved);
    } else {
        employees = [
            { id: 1, name: "Павел", salary: 2500 },
            { id: 2, name: "Наталья", salary: 2000 },
            { id: 3, name: "Семён", salary: 2000 }
        ];
        saveEmployees();
    }
}

function saveServices() {
    localStorage.setItem('photo_services', JSON.stringify(services));
}

function saveEmployees() {
    localStorage.setItem('photo_employees', JSON.stringify(employees));
}

function renderServices() {
    const tbody = document.getElementById('servicesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    services.forEach(service => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = service.id;
        row.insertCell(1).textContent = service.name;
        row.insertCell(2).textContent = service.price + ' ₽';
        
        const actionCell = row.insertCell(3);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteService(service.id);
        actionCell.appendChild(deleteBtn);
    });
}

function renderEmployees() {
    const tbody = document.getElementById('employeesBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    employees.forEach(emp => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = emp.name;
        row.insertCell(1).textContent = emp.salary + ' ₽';
        
        const actionCell = row.insertCell(2);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteEmployee(emp.id);
        actionCell.appendChild(deleteBtn);
    });
}

function addService() {
    const name = prompt('Введите название услуги:');
    if (!name) return;
    const price = parseFloat(prompt('Введите цену:'));
    if (isNaN(price)) return;
    
    const newId = Math.max(...services.map(s => s.id), 0) + 1;
    services.push({ id: newId, name: name, price: price });
    saveServices();
    renderServices();
}

function addEmployee() {
    const name = prompt('Введите имя сотрудника:');
    if (!name) return;
    const salary = parseFloat(prompt('Введите оклад за смену:'));
    if (isNaN(salary)) return;
    
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;
    employees.push({ id: newId, name: name, salary: salary });
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

function saveServicesDirect() {
    saveServices();
    alert('✅ Услуги сохранены!');
}

function saveEmployeesDirect() {
    saveEmployees();
    alert('✅ Сотрудники сохранены!');
}

initDirectories();
