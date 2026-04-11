// Хранилище данных
let orders = [];
let services = [];
let employees = [];

// Инициализация
function init() {
    loadData();
    loadServices();
    loadEmployees();
    renderOrders();
    renderStats();
}

// Загрузка данных из localStorage
function loadData() {
    const saved = localStorage.getItem('photo_orders');
    if (saved) {
        orders = JSON.parse(saved);
    } else {
        orders = [];
    }
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

// Сохранение данных
function saveData() {
    localStorage.setItem('photo_orders', JSON.stringify(orders));
    alert('✅ Данные сохранены!');
}

function saveServices() {
    localStorage.setItem('photo_services', JSON.stringify(services));
}

function saveEmployees() {
    localStorage.setItem('photo_employees', JSON.stringify(employees));
}

// Получение дня недели
function getDayOfWeek(date) {
    const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    return days[date.getDay()];
}

// Добавление заказа
function addOrder() {
    document.getElementById('orderModal').style.display = 'flex';
    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('orderTime').value = new Date().toTimeString().slice(0,5);
    
    const operatorSelect = document.getElementById('orderOperator');
    operatorSelect.innerHTML = '';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        operatorSelect.appendChild(option);
    });
    
    const serviceSelect = document.getElementById('orderService');
    serviceSelect.innerHTML = '';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = service.name + ' (' + service.price + ' ₽)';
        option.setAttribute('data-price', service.price);
        serviceSelect.appendChild(option);
    });
    updatePrice();
}

function updatePrice() {
    const select = document.getElementById('orderService');
    const selected = select.options[select.selectedIndex];
    const price = selected.getAttribute('data-price') || 0;
    document.getElementById('orderPrice').value = price;
    updateSum();
}

function updateSum() {
    const price = parseFloat(document.getElementById('orderPrice').value) || 0;
    const qty = parseInt(document.getElementById('orderQuantity').value) || 1;
    document.getElementById('orderSum').value = price * qty;
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Обработка формы
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = new Date(document.getElementById('orderDate').value);
    const order = {
        id: Date.now(),
        date: date.toLocaleDateString('ru-RU'),
        day: getDayOfWeek(date),
        operator: document.getElementById('orderOperator').value,
        time: document.getElementById('orderTime').value,
        service: document.getElementById('orderService').value,
        price: parseFloat(document.getElementById('orderPrice').value),
        quantity: parseInt(document.getElementById('orderQuantity').value),
        sum: parseFloat(document.getElementById('orderSum').value),
        payment: document.getElementById('orderPayment').value
    };
    
    orders.unshift(order);
    saveData();
    renderOrders();
    renderStats();
    closeModal();
    document.getElementById('orderForm').reset();
});

// Отображение заказов
function renderOrders() {
    const tbody = document.getElementById('ordersBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    orders.forEach(order => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = order.date;
        row.insertCell(1).textContent = order.day;
        row.insertCell(2).textContent = order.operator;
        row.insertCell(3).textContent = order.time;
        row.insertCell(4).textContent = order.service;
        row.insertCell(5).textContent = order.price + ' ₽';
        row.insertCell(6).textContent = order.quantity;
        row.insertCell(7).textContent = order.sum + ' ₽';
        row.insertCell(8).textContent = order.payment;
        
        const deleteCell = row.insertCell(9);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteOrder(order.id);
        deleteCell.appendChild(deleteBtn);
    });
}

function deleteOrder(id) {
    if (confirm('Удалить заказ?')) {
        orders = orders.filter(o => o.id !== id);
        saveData();
        renderOrders();
        renderStats();
    }
}

// Статистика
function renderStats() {
    const stats = {};
    let totalIncome = 0, totalCash = 0, totalCard = 0;
    
    employees.forEach(emp => {
        stats[emp.name] = { shifts: 0, sales: 0, revenue: 0 };
    });
    
    // Собираем уникальные дни для подсчёта смен
    const workedDays = {};
    
    orders.forEach(order => {
        const key = order.date + '_' + order.operator;
        if (!workedDays[key]) {
            workedDays[key] = true;
            if (stats[order.operator]) stats[order.operator].shifts++;
        }
        if (stats[order.operator]) {
            stats[order.operator].sales++;
            stats[order.operator].revenue += order.sum;
        }
        totalIncome += order.sum;
        if (order.payment === 'Наличные') totalCash += order.sum;
        else totalCard += order.sum;
    });
    
    // Заполняем таблицу статистики
    const tbody = document.getElementById('employeeStatsBody');
    if (tbody) {
        tbody.innerHTML = '';
        employees.forEach(emp => {
            const s = stats[emp.name];
            const row = tbody.insertRow();
            row.insertCell(0).textContent = emp.name;
            row.insertCell(1).textContent = s?.shifts || 0;
            row.insertCell(2).textContent = s?.sales || 0;
            row.insertCell(3).textContent = (s?.revenue || 0).toLocaleString() + ' ₽';
            row.insertCell(4).textContent = ((s?.shifts || 0) * emp.salary).toLocaleString() + ' ₽';
        });
    }
    
    document.getElementById('totalIncome').textContent = totalIncome.toLocaleString() + ' ₽';
    document.getElementById('totalCash').textContent = totalCash.toLocaleString() + ' ₽';
    document.getElementById('totalCard').textContent = totalCard.toLocaleString() + ' ₽';
    document.getElementById('totalOrders').textContent = orders.length;
}

function refreshStats() {
    renderStats();
    alert('✅ Статистика обновлена!');
}

function clearAllOrders() {
    if (confirm('Очистить ВСЕ заказы? Это действие нельзя отменить!')) {
        orders = [];
        saveData();
        renderOrders();
        renderStats();
        alert('✅ Все заказы удалены!');
    }
}

function exportToExcel() {
    let csv = "ДАТА,ДЕНЬ,ОПЕРАТОР,ВРЕМЯ,УСЛУГА,ЦЕНА,КОЛ-ВО,СУММА,ОПЛАТА\n";
    orders.forEach(order => {
        csv += `${order.date},${order.day},${order.operator},${order.time},${order.service},${order.price},${order.quantity},${order.sum},${order.payment}\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "заказы.csv";
    link.click();
}

// Запуск
init();
