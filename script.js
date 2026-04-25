// ---------- СПРАВОЧНИК УСЛУГ (ваш прайс) ----------
const SERVICES = [
    "Копирование ч/б A4", "Копирование цветное A4", "Сканирование A4",
    "Ламинирование A4", "Печать фото 10x15", "Печать фото 15x21",
    "Печать фото 21x30", "Фото на документы", "Печать на кружке",
    "Печать на футболке"
];
const PRICES = [10, 35, 25, 150, 35, 75, 200, 350, 750, 1000];

let allData = {};        // { "2026-04-25": { operator, expenses, orders, totals } }
let currentOrders = [];

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    buildOrderRows();
    setupEventListeners();
    setTodayDate();
    loadSelectedDay();
    renderDashboard();
});

// Построить 15 пустых строк
function buildOrderRows() {
    const tbody = document.getElementById('ordersBody');
    tbody.innerHTML = '';
    for (let i = 1; i <= 15; i++) {
        const tr = document.createElement('tr');
        // №
        const tdNum = document.createElement('td'); tdNum.innerText = i;
        tr.appendChild(tdNum);
        // Время
        const tdTime = document.createElement('td');
        const selTime = document.createElement('select');
        selTime.className = `time-${i}`;
        fillTimeOptions(selTime);
        tdTime.appendChild(selTime);
        tr.appendChild(tdTime);
        // Услуга
        const tdServ = document.createElement('td');
        const selServ = document.createElement('select');
        selServ.className = `serv-${i}`;
        SERVICES.forEach(s => { let opt = new Option(s, s); selServ.appendChild(opt); });
        selServ.addEventListener('change', () => updatePrice(i));
        tdServ.appendChild(selServ);
        tr.appendChild(tdServ);
        // Цена
        const tdPrice = document.createElement('td');
        const inpPrice = document.createElement('input'); inpPrice.type = 'text'; inpPrice.readOnly = true;
        inpPrice.className = `price-${i}`;
        tdPrice.appendChild(inpPrice);
        tr.appendChild(tdPrice);
        // Кол-во
        const tdQty = document.createElement('td');
        const inpQty = document.createElement('input'); inpQty.type = 'number'; inpQty.value = 0; inpQty.min = 0;
        inpQty.className = `qty-${i}`;
        inpQty.addEventListener('input', () => updateOrder(i));
        tdQty.appendChild(inpQty);
        tr.appendChild(tdQty);
        // Сумма
        const tdSum = document.createElement('td');
        const inpSum = document.createElement('input'); inpSum.readOnly = true;
        inpSum.className = `sum-${i}`;
        tdSum.appendChild(inpSum);
        tr.appendChild(tdSum);
        // Оплата
        const tdPay = document.createElement('td');
        const selPay = document.createElement('select');
        ['Наличные', 'Карта'].forEach(p => { let opt = new Option(p, p); selPay.appendChild(opt); });
        selPay.className = `pay-${i}`;
        selPay.addEventListener('change', () => updateOrder(i));
        tdPay.appendChild(selPay);
        tr.appendChild(tdPay);
        tbody.appendChild(tr);
    }
}

function fillTimeOptions(select) {
    for (let h = 9; h <= 21; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 21 && m > 0) continue;
            let val = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
            select.appendChild(new Option(val, val));
        }
    }
}

function updatePrice(row) {
    const servSel = document.querySelector(`.serv-${row}`);
    const idx = SERVICES.indexOf(servSel.value);
    const priceInp = document.querySelector(`.price-${row}`);
    if (idx !== -1) priceInp.value = PRICES[idx];
    else priceInp.value = '';
    updateOrder(row);
}

function updateOrder(row) {
    const price = parseFloat(document.querySelector(`.price-${row}`).value) || 0;
    const qty = parseInt(document.querySelector(`.qty-${row}`).value) || 0;
    const sum = price * qty;
    document.querySelector(`.sum-${row}`).value = sum.toFixed(2);
    recalcDailyTotals();
}

function recalcDailyTotals() {
    let income = 0, cash = 0, card = 0, orders = 0;
    for (let i = 1; i <= 15; i++) {
        let qty = parseInt(document.querySelector(`.qty-${i}`)?.value) || 0;
        let sum = parseFloat(document.querySelector(`.sum-${i}`)?.value) || 0;
        if (qty > 0) {
            income += sum;
            orders++;
            let payment = document.querySelector(`.pay-${i}`).value;
            if (payment === 'Наличные') cash += sum;
            else card += sum;
        }
    }
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    const net = income - expenses;
    document.getElementById('totalIncome').innerText = income.toFixed(2) + ' ₽';
    document.getElementById('totalExpenses').innerText = expenses.toFixed(2) + ' ₽';
    document.getElementById('netProfit').innerText = net.toFixed(2) + ' ₽';
    document.getElementById('cashTotal').innerText = cash.toFixed(2) + ' ₽';
    document.getElementById('cardTotal').innerText = card.toFixed(2) + ' ₽';
    document.getElementById('ordersCount').innerText = orders;
}

// Сохранить день в localStorage + в глобальный allData
function saveCurrentDay() {
    const date = document.getElementById('workDate').value;
    if (!date) { alert("Выберите дату"); return; }
    const operator = document.getElementById('operatorSelect').value;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    let ordersList = [];
    for (let i = 1; i <= 15; i++) {
        let qty = parseInt(document.querySelector(`.qty-${i}`)?.value) || 0;
        if (qty === 0) continue;
        ordersList.push({
            time: document.querySelector(`.time-${i}`).value,
            service: document.querySelector(`.serv-${i}`).value,
            qty: qty,
            price: parseFloat(document.querySelector(`.price-${i}`).value) || 0,
            sum: parseFloat(document.querySelector(`.sum-${i}`).value) || 0,
            payment: document.querySelector(`.pay-${i}`).value
        });
    }
    const income = parseFloat(document.getElementById('totalIncome').innerText) || 0;
    const net = parseFloat(document.getElementById('netProfit').innerText) || 0;
    allData[date] = {
        operator, expenses, orders: ordersList,
        totalIncome: income, netProfit: net
    };
    saveToLocalStorage();
    renderDashboard();
    alert(`✅ Смена за ${date} сохранена (${ordersList.length} операций)`);
}

function loadSelectedDay() {
    const date = document.getElementById('workDate').value;
    if (!date || !allData[date]) {
        // очистить поля, но не стирать весь день, если данных нет – пустые строки
        for (let i = 1; i <= 15; i++) {
            if(document.querySelector(`.qty-${i}`)) document.querySelector(`.qty-${i}`).value = 0;
            if(document.querySelector(`.sum-${i}`)) document.querySelector(`.sum-${i}`).value = '';
        }
        document.getElementById('expenses').value = 0;
        document.getElementById('operatorSelect').value = "Наталья";
        recalcDailyTotals();
        return;
    }
    const day = allData[date];
    document.getElementById('operatorSelect').value = day.operator;
    document.getElementById('expenses').value = day.expenses;
    // очистка
    for (let i = 1; i <= 15; i++) {
        document.querySelector(`.qty-${i}`).value = 0;
        document.querySelector(`.sum-${i}`).value = '';
    }
    day.orders.forEach((ord, idx) => {
        const row = idx+1;
        if(row <= 15) {
            document.querySelector(`.time-${row}`).value = ord.time;
            document.querySelector(`.serv-${row}`).value = ord.service;
            updatePrice(row);
            document.querySelector(`.qty-${row}`).value = ord.qty;
            document.querySelector(`.pay-${row}`).value = ord.payment;
            updateOrder(row);
        }
    });
    recalcDailyTotals();
}

// ---------- ЭКСПОРТ В EXCEL + ПЛАТЁЖКА ----------
function exportFullExcel() {
    let rowsExcel = [["ДАТА","ОПЕРАТОР","ВРЕМЯ","УСЛУГА","ЦЕНА","КОЛ-ВО","СУММА","ОПЛАТА"]];
    for (let [date, data] of Object.entries(allData)) {
        if (data.orders.length === 0) rowsExcel.push([date, data.operator, "", "", "", "", "", ""]);
        else data.orders.forEach(o => rowsExcel.push([date, data.operator, o.time, o.service, o.price, o.qty, o.sum, o.payment]));
    }
    const ws = XLSX.utils.aoa_to_sheet(rowsExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Заказы");
    XLSX.writeFile(wb, `A4PRINT_orders_${new Date().toISOString().slice(0,10)}.xlsx`);
}

function openPayrollPage() {
    window.open('payroll.html', '_blank');
}

// Дашборд с графиком (последние 7 дней чистая прибыль)
function renderDashboard() {
    const dates = Object.keys(allData).sort();
    const last7 = dates.slice(-7);
    const profits = last7.map(d => allData[d].netProfit || 0);
    const ctx = document.getElementById('profitChart')?.getContext('2d');
    if (!ctx) return;
    if (window.profitChartInstance) window.profitChartInstance.destroy();
    window.profitChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: last7, datasets: [{ label: 'Чистая прибыль (₽)', data: profits, borderColor: '#1f7b4d', tension: 0.2, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
}

// Работа с localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('A4PRINT_full');
    if (saved) allData = JSON.parse(saved);
    else allData = {};
}
function saveToLocalStorage() {
    localStorage.setItem('A4PRINT_full', JSON.stringify(allData));
}
function setTodayDate() {
    const today = new Date().toISOString().slice(0,10);
    document.getElementById('workDate').value = today;
}
function clearCurrentDayUI() {
    if(confirm("Стереть все заказы за эту дату?")) {
        for (let i=1;i<=15;i++) {
            if(document.querySelector(`.qty-${i}`)) document.querySelector(`.qty-${i}`).value = 0;
            if(document.querySelector(`.sum-${i}`)) document.querySelector(`.sum-${i}`).value = '';
        }
        document.getElementById('expenses').value = 0;
        recalcDailyTotals();
        // не удаляем из архива, пока手动 не сохранили
    }
}

function setupEventListeners() {
    document.getElementById('saveDayBtn')?.addEventListener('click', saveCurrentDay);
    document.getElementById('clearDayBtn')?.addEventListener('click', clearCurrentDayUI);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportFullExcel);
    document.getElementById('payrollBtn')?.addEventListener('click', openPayrollPage);
    document.getElementById('workDate')?.addEventListener('change', loadSelectedDay);
    document.getElementById('expenses')?.addEventListener('input', recalcDailyTotals);
}
