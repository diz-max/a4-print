// Хранилище данных
let orders = [];
let services = [];
let employees = [];
let currentServiceRows = [];

// Инициализация
function init() {
    loadData();
    loadServices();
    loadEmployees();
    renderOrders();
    renderStats();
    initServiceRows();
}

function initServiceRows() {
    currentServiceRows = [{ serviceId: '', quantity: 1 }];
}

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

function getDayOfWeek(date) {
    const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    return days[date.getDay()];
}

// Добавление заказа с мультивыбором
function addOrder() {
    document.getElementById('orderModal').style.display = 'flex';
    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('orderTime').value = new Date().toTimeString().slice(0,5);
    document.getElementById('orderClient').value = '';
    
    const operatorSelect = document.getElementById('orderOperator');
    operatorSelect.innerHTML = '';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        operatorSelect.appendChild(option);
    });
    
    initServiceRows();
    renderServiceRows();
}

function renderServiceRows() {
    const container = document.getElementById('servicesList');
    container.innerHTML = '';
    
    currentServiceRows.forEach((row, index) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'service-row';
        
        // Выбор услуги
        const select = document.createElement('select');
        select.innerHTML = '<option value="">-- Выберите услугу --</option>';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} (${service.price} ₽)`;
            option.setAttribute('data-price', service.price);
            option.setAttribute('data-name', service.name);
            if (row.serviceId == service.id) option.selected = true;
            select.appendChild(option);
        });
        select.onchange = () => updateServiceRow(index);
        
        // Количество
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = row.quantity || 1;
        quantityInput.min = 1;
        quantityInput.style.width = '70px';
        quantityInput.onchange = () => updateServiceRow(index);
        
        // Цена
        const priceSpan = document.createElement('span');
        priceSpan.className = 'service-price';
        priceSpan.id = `price_${index}`;
        
        // Сумма
        const sumSpan = document.createElement('span');
        sumSpan.className = 'service-sum';
        sumSpan.id = `sum_${index}`;
        
        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => removeServiceRow(index);
        
        rowDiv.appendChild(select);
        rowDiv.appendChild(document.createTextNode(' × '));
        rowDiv.appendChild(quantityInput);
        rowDiv.appendChild(document.createTextNode(' шт. → '));
        rowDiv.appendChild(priceSpan);
        rowDiv.appendChild(document.createTextNode(' → '));
        rowDiv.appendChild(sumSpan);
        rowDiv.appendChild(deleteBtn);
        
        container.appendChild(rowDiv);
        updateServiceRow(index);
    });
}

function updateServiceRow(index) {
    const row = currentServiceRows[index];
    const select = document.querySelectorAll('.service-row select')[index];
    const quantityInput = document.querySelectorAll('.service-row input[type="number"]')[index];
    
    if (select && select.value) {
        const selectedOption = select.options[select.selectedIndex];
        const price = parseFloat(selectedOption.getAttribute('data-price'));
        const quantity = parseInt(quantityInput.value) || 1;
        
        row.serviceId = parseInt(select.value);
        row.serviceName = selectedOption.getAttribute('data-name');
        row.price = price;
        row.quantity = quantity;
        row.sum = price * quantity;
        
        document.getElementById(`price_${index}`).textContent = price + ' ₽';
        document.getElementById(`sum_${index}`).textContent = (price * quantity).toLocaleString() + ' ₽';
    } else {
        row.serviceId = null;
        row.price = 0;
        row.quantity = 0;
        row.sum = 0;
        if (document.getElementById(`price_${index}`)) document.getElementById(`price_${index}`).textContent = '0 ₽';
        if (document.getElementById(`sum_${index}`)) document.getElementById(`sum_${index}`).textContent = '0 ₽';
    }
    
    updateTotalSum();
}

function addServiceRow() {
    currentServiceRows.push({ serviceId: '', quantity: 1 });
    renderServiceRows();
}

function removeServiceRow(index) {
    currentServiceRows.splice(index, 1);
    renderServiceRows();
}

function updateTotalSum() {
    let total = 0;
    currentServiceRows.forEach(row => {
        total += row.sum || 0;
    });
    document.getElementById('totalOrderSum').textContent = total.toLocaleString();
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
    initServiceRows();
}

// Обработка формы заказа
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const validServices = currentServiceRows.filter(row => row.serviceId);
    if (validServices.length === 0) {
        alert('❌ Добавьте хотя бы одну услугу!');
        return;
    }
    
    const date = new Date(document.getElementById('orderDate').value);
    const servicesList = validServices.map(s => `${s.serviceName} x${s.quantity} = ${s.sum} ₽`).join(', ');
    const totalSum = validServices.reduce((sum, s) => sum + s.sum, 0);
    
    const order = {
        id: Date.now(),
        date: date.toLocaleDateString('ru-RU'),
        day: getDayOfWeek(date),
        operator: document.getElementById('orderOperator').value,
        time: document.getElementById('orderTime').value,
        client: document.getElementById('orderClient').value,
        services: validServices.map(s => ({
            name: s.serviceName,
            quantity: s.quantity,
            price: s.price,
            sum: s.sum
        })),
        servicesText: servicesList,
        totalSum: totalSum,
        payment: document.getElementById('orderPayment').value
    };
    
    orders.unshift(order);
    saveData();
    renderOrders();
    renderStats();
    closeModal();
    document.getElementById('orderForm').reset();
});

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
        row.insertCell(4).textContent = order.servicesText;
        row.insertCell(5).textContent = order.services.reduce((sum, s) => sum + s.quantity, 0);
        row.insertCell(6).textContent = order.totalSum.toLocaleString() + ' ₽';
        row.insertCell(7).textContent = order.payment;
        
        const actionCell = row.insertCell(8);
        
        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️';
        printBtn.className = 'print-btn';
        printBtn.onclick = () => showReceipt(order.id);
        actionCell.appendChild(printBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteOrder(order.id);
        actionCell.appendChild(deleteBtn);
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

// ПЕЧАТЬ КВИТАНЦИИ
function showReceipt(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const receiptData = document.getElementById('receiptData');
    receiptData.innerHTML = `
        <div class="receipt-details">
            <p><strong>№ заказа:</strong> ${order.id}</p>
            <p><strong>Дата:</strong> ${order.date} (${order.day})</p>
            <p><strong>Время:</strong> ${order.time}</p>
            <p><strong>Оператор:</strong> ${order.operator}</p>
            <p><strong>Клиент:</strong> ${order.client || '_______________'}</p>
            <hr>
            <table class="services-table">
                <thead><tr><th>Услуга</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
                <tbody>
                    ${order.services.map(s => `
                        <tr><td>${s.name}</td><td>${s.quantity}</td><td>${s.price} ₽</td><td>${s.sum} ₽</td></tr>
                    `).join('')}
                </tbody>
                <tfoot><tr><th colspan="3">ИТОГО:</th><th>${order.totalSum} ₽</th></tr></tfoot>
            </table>
            <hr>
            <p><strong>Оплата:</strong> ${order.payment}</p>
        </div>
    `;
    
    document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

function printReceiptNow() {
    const receiptContent = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Квитанция</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;} .receipt{max-width:400px;margin:0 auto;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="receipt">' + receiptContent + '</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function printReceipt() {
    const selectedRow = document.querySelector('#ordersBody tr');
    if (!selectedRow) {
        alert('❌ Выберите заказ для печати!');
        return;
    }
    // Получаем ID из первой ячейки строки (нужно добавить скрытое поле или искать по дате)
    // Для простоты предлагаем выбрать заказ из выпадающего списка
    const orderIds = orders.map(o => ({ id: o.id, date: o.date }));
    const orderId = prompt('Введите номер заказа для печати:\n' + orderIds.map(o => `${o.id} (${o.date})`).join('\n'));
    if (orderId) {
        const order = orders.find(o => o.id == orderId);
        if (order) showReceipt(order.id);
        else alert('Заказ не найден!');
    }
}

// Статистика
function renderStats() {
    const stats = {};
    let totalIncome = 0, totalCash = 0, totalCard = 0;
    
    employees.forEach(emp => {
        stats[emp.name] = { shifts: 0, sales: 0, revenue: 0 };
    });
    
    const workedDays = {};
    
    orders.forEach(order => {
        const key = order.date + '_' + order.operator;
        if (!workedDays[key]) {
            workedDays[key] = true;
            if (stats[order.operator]) stats[order.operator].shifts++;
        }
        if (stats[order.operator]) {
            stats[order.operator].sales++;
            stats[order.operator].revenue += order.totalSum;
        }
        totalIncome += order.totalSum;
        if (order.payment === 'Наличные') totalCash += order.totalSum;
        else totalCard += order.totalSum;
    });
    
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
    let csv = "ДАТА,ДЕНЬ,ОПЕРАТОР,ВРЕМЯ,КЛИЕНТ,УСЛУГИ,СУММА,ОПЛАТА\n";
    orders.forEach(order => {
        csv += `${order.date},${order.day},${order.operator},${order.time},${order.client || ''},"${order.servicesText}",${order.totalSum},${order.payment}\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "заказы.csv";
    link.click();
}

// Запуск
init();
