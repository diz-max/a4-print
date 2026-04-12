// Хранилище
let cart = [];
let services = [];
let employees = [];
let orders = [];
let currentPayment = 'Наличные';
let currentOperator = 'Павел';
let lastOrder = null;

// Инициализация
function init() {
    loadServices();
    loadEmployees();
    loadOrders();
    renderServicesGrid();
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const dtElement = document.getElementById('currentDateTime');
    if (dtElement) dtElement.textContent = now.toLocaleString('ru-RU');
}

function loadServices() {
    const saved = localStorage.getItem('a4print_services');
    if (saved) {
        services = JSON.parse(saved);
    } else {
        services = [
            { id: 1, name: "Копирование ч/б A4", price: 10 },
            { id: 2, name: "Копирование цветное A4", price: 35 },
            { id: 3, name: "Сканирование A4", price: 25 },
            { id: 4, name: "Ламинирование A4", price: 150 },
            { id: 5, name: "Печать фото 10x15", price: 35 },
            { id: 6, name: "Печать фото 15x21", price: 75 },
            { id: 7, name: "Печать фото 21x30", price: 200 },
            { id: 8, name: "Фото на документы", price: 350 },
            { id: 9, name: "Печать на кружке", price: 750 },
            { id: 10, name: "Печать на футболке", price: 1000 }
        ];
        saveServices();
    }
}

function loadEmployees() {
    const saved = localStorage.getItem('a4print_employees');
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

function loadOrders() {
    const saved = localStorage.getItem('a4print_orders');
    if (saved) {
        orders = JSON.parse(saved);
    } else {
        orders = [];
    }
}

function saveServices() { localStorage.setItem('a4print_services', JSON.stringify(services)); }
function saveEmployees() { localStorage.setItem('a4print_employees', JSON.stringify(employees)); }
function saveOrders() { localStorage.setItem('a4print_orders', JSON.stringify(orders)); }

function renderServicesGrid() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.onclick = () => addToCart(service);
        card.innerHTML = `<div class="service-name">${service.name}</div><div class="service-price">${service.price} ₽</div>`;
        grid.appendChild(card);
    });
}

function filterServices() {
    const search = document.getElementById('serviceSearch').value.toLowerCase();
    document.querySelectorAll('.service-card').forEach(card => {
        const name = card.querySelector('.service-name').textContent.toLowerCase();
        card.style.display = name.includes(search) ? 'flex' : 'none';
    });
}

function addToCart(service) {
    const existing = cart.find(item => item.id === service.id);
    if (existing) existing.quantity++;
    else cart.push({ id: service.id, name: service.name, price: service.price, quantity: 1 });
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">➕ Нажмите на услугу для добавления</div>';
        totalSpan.textContent = '0';
        return;
    }
    let total = 0;
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const sum = item.price * item.quantity;
        total += sum;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">${item.price} ₽ × ${item.quantity}</div>
            </div>
            <div class="cart-item-price"><div class="cart-item-amount">${sum} ₽</div></div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">🗑️</button>
        `;
        container.appendChild(cartItem);
    });
    totalSpan.textContent = total.toLocaleString();
}

function removeFromCart(index) { cart.splice(index, 1); renderCart(); }
function clearCart() { if (confirm('Очистить корзину?')) { cart = []; renderCart(); } }

function setPayment(payment) {
    currentPayment = payment;
    const cashBtn = document.querySelector('.cash-btn');
    const cardBtn = document.querySelector('.card-btn');
    if (cashBtn && cardBtn) {
        cashBtn.style.opacity = payment === 'Наличные' ? '1' : '0.6';
        cardBtn.style.opacity = payment === 'Карта' ? '1' : '0.6';
    }
}

function switchOperator() {
    const names = employees.map(e => e.name);
    const newOperator = prompt(`Выберите оператора:\n${names.join('\n')}`, currentOperator);
    if (newOperator && names.includes(newOperator)) {
        currentOperator = newOperator;
        document.getElementById('currentOperator').textContent = currentOperator;
    }
}

function checkout() {
    if (cart.length === 0) { alert('❌ Корзина пуста!'); return; }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const client = document.getElementById('clientName').value;
    if (!client) {
        alert('❌ Введите ФИО клиента!');
        return;
    }
    
    const order = {
        id: Date.now(),
        number: Math.floor(Math.random() * 9000) + 1000,
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU'),
        operator: currentOperator,
        client: client,
        items: [...cart],
        total: total,
        payment: currentPayment
    };
    
    orders.unshift(order);
    saveOrders();
    lastOrder = order;
    showOrderForm(order);
    cart = [];
    renderCart();
    document.getElementById('clientName').value = '';
}

function showOrderForm(order) {
    const formHtml = `
        <div class="order-form-header">
            <h2>A4-PRINT</h2>
            <h3>БЛАНК ЗАКАЗА №${order.number}</h3>
        </div>
        <div class="order-form-body">
            <div class="order-row">
                <div class="order-field">
                    <label>Дата заказа:</label>
                    <span>${order.date}</span>
                </div>
                <div class="order-field">
                    <label>Время:</label>
                    <span>${order.time}</span>
                </div>
            </div>
            <div class="order-row">
                <div class="order-field">
                    <label>Оператор:</label>
                    <span>${order.operator}</span>
                </div>
                <div class="order-field">
                    <label>Клиент:</label>
                    <span>${order.client}</span>
                </div>
            </div>
            
            <div class="order-table-container">
                <table class="order-table">
                    <thead>
                        <tr><th>№</th><th>Услуга</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price} ₽</td>
                                <td>${item.price * item.quantity} ₽</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="4"><strong>ИТОГО:</strong></td>
                            <td><strong>${order.total} ₽</strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong>Оплата:</strong></td>
                            <td><strong>${order.payment}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="order-signatures">
                <div class="signature">
                    <div class="sign-line">_________________________</div>
                    <div class="sign-label">Подпись оператора</div>
                </div>
                <div class="signature">
                    <div class="sign-line">_________________________</div>
                    <div class="sign-label">Подпись клиента</div>
                </div>
            </div>
            
            <div class="order-footer">
                <p>СПАСИБО ЗА ЗАКАЗ!</p>
                <p class="small">Оригинал бланка остаётся у клиента</p>
            </div>
        </div>
    `;
    
    document.getElementById('orderFormContent').innerHTML = formHtml;
    document.getElementById('orderFormModal').style.display = 'flex';
}

function closeOrderFormModal() {
    document.getElementById('orderFormModal').style.display = 'none';
}

function printOrderForm() {
    const content = document.getElementById('orderFormContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Бланк заказа A4-Print</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: white; }
                .order-form-header { text-align: center; margin-bottom: 25px; }
                .order-form-header h2 { color: #e94560; font-size: 24px; margin-bottom: 5px; }
                .order-form-header h3 { color: #2c3e50; font-size: 18px; }
                .order-row { display: flex; gap: 30px; margin-bottom: 15px; flex-wrap: wrap; }
                .order-field { flex: 1; }
                .order-field label { font-weight: bold; color: #6c757d; margin-right: 10px; }
                .order-table-container { margin: 20px 0; overflow-x: auto; }
                .order-table { width: 100%; border-collapse: collapse; }
                .order-table th, .order-table td { border: 1px solid #dee2e6; padding: 10px; text-align: left; }
                .order-table th { background: #f8f9fa; font-weight: bold; }
                .total-row td { background: #f8f9fa; font-weight: bold; }
                .order-signatures { display: flex; gap: 50px; margin: 30px 0; justify-content: center; }
                .signature { text-align: center; flex: 1; }
                .sign-line { border-bottom: 1px solid #2c3e50; width: 200px; margin: 0 auto 5px; padding-top: 20px; }
                .sign-label { font-size: 12px; color: #6c757d; }
                .order-footer { text-align: center; margin-top: 30px; }
                .order-footer p { font-weight: bold; color: #e94560; }
                .order-footer .small { font-size: 10px; color: #6c757d; margin-top: 5px; }
                @media print {
                    body { padding: 0; }
                    .order-signatures { margin-top: 50px; }
                }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showOrdersHistory() {
    if (orders.length === 0) { alert('История пуста'); return; }
    let history = '📜 ИСТОРИЯ ЗАКАЗОВ\n\n';
    orders.slice(0, 20).forEach(o => {
        history += `№${o.number} | ${o.date} | ${o.client} | ${o.total} ₽ | ${o.payment}\n`;
    });
    alert(history);
}

function showStats() {
    let totalIncome = 0, totalCash = 0, totalCard = 0;
    const opStats = {};
    employees.forEach(e => opStats[e.name] = { shifts: 0, revenue: 0 });
    const workedDays = {};
    orders.forEach(o => {
        totalIncome += o.total;
        if (o.payment === 'Наличные') totalCash += o.total;
        else totalCard += o.total;
        const key = o.date + '_' + o.operator;
        if (!workedDays[key]) { workedDays[key] = true; if (opStats[o.operator]) opStats[o.operator].shifts++; }
        if (opStats[o.operator]) opStats[o.operator].revenue += o.total;
    });
    let html = `<div style="padding:20px;"><h3>💰 ОБЩАЯ СТАТИСТИКА</h3>
        <p><strong>Доход:</strong> ${totalIncome.toLocaleString()} ₽</p>
        <p><strong>Наличными:</strong> ${totalCash.toLocaleString()} ₽</p>
        <p><strong>Картой:</strong> ${totalCard.toLocaleString()} ₽</p>
        <p><strong>Заказов:</strong> ${orders.length}</p>
        <p><strong>Средний чек:</strong> ${orders.length ? (totalIncome / orders.length).toLocaleString() : 0} ₽</p>
        <hr>
        <h3>👥 ПО СОТРУДНИКАМ</h3>`;
    employees.forEach(e => {
        const s = opStats[e.name];
        html += `<p><strong>${e.name}</strong>: ${s?.shifts || 0} смен, выручка ${(s?.revenue || 0).toLocaleString()} ₽, зарплата ${((s?.shifts || 0) * e.salary).toLocaleString()} ₽</p>`;
    });
    html += `</div>`;
    document.getElementById('statsContent').innerHTML = html;
    document.getElementById('statsModal').style.display = 'flex';
}

function closeStatsModal() { document.getElementById('statsModal').style.display = 'none'; }

function exportData() {
    let csv = "№,ДАТА,ВРЕМЯ,ОПЕРАТОР,КЛИЕНТ,УСЛУГИ,СУММА,ОПЛАТА\n";
    orders.forEach(o => {
        const servicesText = o.items.map(i => `${i.name} x${i.quantity}`).join(', ');
        csv += `${o.number},${o.date},${o.time},${o.operator},${o.client},"${servicesText}",${o.total},${o.payment}\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "a4print_orders.csv";
    link.click();
}

init();
