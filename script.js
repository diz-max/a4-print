let cart = [];
let services = [];
let employees = [];
let orders = [];
let currentPayment = 'Наличные';
let currentOperator = 'Павел';

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
    const el = document.getElementById('currentDateTime');
    if (el) el.textContent = now.toLocaleString('ru-RU');
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
    orders = saved ? JSON.parse(saved) : [];
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
        card.className = 'service-card-mobile';
        card.onclick = () => addToCart(service);
        card.innerHTML = `
            <div class="service-name-mobile">${service.name}</div>
            <div class="service-price-mobile">${service.price} ₽</div>
        `;
        grid.appendChild(card);
    });
}

function filterServices() {
    const search = document.getElementById('serviceSearch').value.toLowerCase();
    document.querySelectorAll('.service-card-mobile').forEach(card => {
        const name = card.querySelector('.service-name-mobile').textContent.toLowerCase();
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
        container.innerHTML = '<div class="cart-empty-mobile">➕ Нажмите на услугу</div>';
        if (totalSpan) totalSpan.textContent = '0';
        return;
    }
    let total = 0;
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const sum = item.price * item.quantity;
        total += sum;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item-mobile';
        cartItem.innerHTML = `
            <div class="cart-item-info-mobile">
                <div class="cart-item-name-mobile">${item.name}</div>
                <div class="cart-item-details-mobile">${item.price} ₽ × ${item.quantity}</div>
            </div>
            <div class="cart-item-price-mobile">
                <div class="cart-item-amount-mobile">${sum} ₽</div>
            </div>
            <button class="cart-item-remove-mobile" onclick="removeFromCart(${index})">✕</button>
        `;
        container.appendChild(cartItem);
    });
    if (totalSpan) totalSpan.textContent = total.toLocaleString();
}

function removeFromCart(index) { cart.splice(index, 1); renderCart(); }
function clearCart() { if (confirm('Очистить корзину?')) { cart = []; renderCart(); } }

function setPayment(payment) {
    currentPayment = payment;
    const cashBtn = document.querySelector('.btn-payment-mobile.cash');
    const cardBtn = document.querySelector('.btn-payment-mobile.card');
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
    if (cart.length === 0) { alert('Корзина пуста'); return; }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const client = document.getElementById('clientName').value;
    if (!client) { alert('Введите ФИО клиента'); return; }
    
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
    showOrderForm(order);
    cart = [];
    renderCart();
    document.getElementById('clientName').value = '';
}

function showOrderForm(order) {
    const html = `
        <div class="order-form-header-mobile">
            <h2>A4-PRINT</h2>
            <h3>Бланк заказа №${order.number}</h3>
        </div>
        <div class="order-row-mobile">
            <div class="order-field-mobile"><label>Дата:</label><span>${order.date}</span></div>
            <div class="order-field-mobile"><label>Время:</label><span>${order.time}</span></div>
        </div>
        <div class="order-row-mobile">
            <div class="order-field-mobile"><label>Оператор:</label><span>${order.operator}</span></div>
            <div class="order-field-mobile"><label>Клиент:</label><span>${order.client}</span></div>
        </div>
        <table class="order-table-mobile">
            <thead><tr><th>№</th><th>Услуга</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>${order.items.map((item, idx) => `<tr><td>${idx+1}</td><td>${item.name}</td><td>${item.quantity}</td><td>${item.price} ₽</td><td>${item.price * item.quantity} ₽</td></tr>`).join('')}</tbody>
            <tfoot><tr><td colspan="4"><strong>ИТОГО:</strong></td><td><strong>${order.total} ₽</strong></td></tr>
            <tr><td colspan="4"><strong>Оплата:</strong></td><td><strong>${order.payment}</strong></td></tr></tfoot>
        </table>
        <div class="order-signatures-mobile">
            <div class="signature-mobile"><div class="sign-line-mobile"></div><div class="sign-label-mobile">Подпись оператора</div></div>
            <div class="signature-mobile"><div class="sign-line-mobile"></div><div class="sign-label-mobile">Подпись клиента</div></div>
        </div>
        <div class="order-footer-mobile"><p>СПАСИБО ЗА ЗАКАЗ!</p></div>
    `;
    document.getElementById('orderFormContent').innerHTML = html;
    document.getElementById('orderFormModal').style.display = 'flex';
}

function closeOrderFormModal() { document.getElementById('orderFormModal').style.display = 'none'; }

function printOrderForm() {
    const content = document.getElementById('orderFormContent').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
        <html><head><title>Бланк заказа</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: white; }
            .order-form-header-mobile { text-align: center; margin-bottom: 20px; }
            .order-form-header-mobile h2 { color: #e94560; }
            .order-row-mobile { display: flex; gap: 20px; margin-bottom: 15px; flex-wrap: wrap; }
            .order-field-mobile { flex: 1; }
            .order-field-mobile label { font-weight: 600; margin-right: 10px; }
            .order-table-mobile { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .order-table-mobile th, .order-table-mobile td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .order-table-mobile th { background: #f5f5f7; }
            .order-signatures-mobile { display: flex; gap: 30px; margin: 30px 0; justify-content: center; flex-wrap: wrap; }
            .signature-mobile { text-align: center; flex: 1; min-width: 150px; }
            .sign-line-mobile { border-bottom: 1px solid #000; width: 100%; margin: 0 auto 8px; padding-top: 20px; }
            .order-footer-mobile { text-align: center; margin-top: 20px; }
            @media print { body { padding: 0; } }
        </style>
        </head><body>${content}</body></html>
    `);
    w.document.close();
    w.print();
}

function showOrdersHistory() {
    if (orders.length === 0) { alert('История пуста'); return; }
    let history = 'ИСТОРИЯ ЗАКАЗОВ\n\n';
    orders.slice(0, 20).forEach(o => { history += `№${o.number} | ${o.date} | ${o.client} | ${o.total} ₽\n`; });
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
    let html = `<div><h3>💰 Общая статистика</h3>
        <p><strong>Доход:</strong> ${totalIncome.toLocaleString()} ₽</p>
        <p><strong>Наличными:</strong> ${totalCash.toLocaleString()} ₽</p>
        <p><strong>Картой:</strong> ${totalCard.toLocaleString()} ₽</p>
        <p><strong>Заказов:</strong> ${orders.length}</p>
        <hr><h3>👥 По сотрудникам</h3>`;
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

document.addEventListener('DOMContentLoaded', init);
