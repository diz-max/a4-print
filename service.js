let repairs = [];
let selectedRepairId = null;

function initService() {
    loadRepairs();
    renderRepairsList();
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const dt = document.getElementById('currentDateTime');
    if (dt) dt.textContent = now.toLocaleString('ru-RU');
}

function loadRepairs() {
    const saved = localStorage.getItem('a4print_repairs');
    repairs = saved ? JSON.parse(saved) : [];
}

function saveRepairs() { localStorage.setItem('a4print_repairs', JSON.stringify(repairs)); }

function addRepair() {
    const client = document.getElementById('repairClient').value;
    if (!client) { alert('❌ Введите клиента!'); return; }
    const repair = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        client: client,
        phone: document.getElementById('repairPhone').value,
        equipment: document.getElementById('repairEquipment').value,
        model: document.getElementById('repairModel').value,
        serial: document.getElementById('repairSerial').value,
        issue: document.getElementById('repairIssue').value,
        accessories: document.getElementById('repairAccessories').value,
        cost: parseFloat(document.getElementById('repairCost').value) || 0,
        status: 'Принято'
    };
    repairs.unshift(repair);
    saveRepairs();
    renderRepairsList();
    document.getElementById('repairForm')?.reset();
    alert('✅ Ремонт добавлен!');
}

function renderRepairsList() {
    const container = document.getElementById('repairsList');
    if (!container) return;
    if (repairs.length === 0) { container.innerHTML = '<div style="text-align:center;padding:40px;">📭 Нет ремонтов</div>'; return; }
    container.innerHTML = '';
    repairs.forEach(r => {
        const statusClass = { 'Принято':'status-accepted', 'В работе':'status-work', 'Готово':'status-ready', 'Выдано':'status-issued' }[r.status] || 'status-accepted';
        const statusText = { 'Принято':'📥 ПРИНЯТО', 'В работе':'🔧 В РАБОТЕ', 'Готово':'✅ ГОТОВО', 'Выдано':'📦 ВЫДАНО' }[r.status] || r.status;
        const card = document.createElement('div');
        card.className = 'repair-card';
        card.onclick = () => selectRepair(r.id);
        card.innerHTML = `
            <div class="repair-header"><span class="repair-id">№${r.id}</span><span class="repair-date">${r.date}</span></div>
            <div class="repair-client">👤 ${r.client}</div>
            <div class="repair-equipment">🖥️ ${r.equipment} ${r.model ? `(${r.model})` : ''}</div>
            <div class="repair-status ${statusClass}">${statusText}</div>
            <div class="repair-cost">💰 ${r.cost.toLocaleString()} ₽</div>
        `;
        container.appendChild(card);
    });
}

function selectRepair(id) { selectedRepairId = id; document.getElementById('printModal').style.display = 'flex'; }
function closePrintModal() { document.getElementById('printModal').style.display = 'none'; selectedRepairId = null; }

function printAcceptance() {
    if (!selectedRepairId) { alert('❌ Выберите ремонт!'); return; }
    const r = repairs.find(r => r.id === selectedRepairId);
    if (!r) return;
    const html = `<div style="max-width:500px;margin:0 auto;font-family:monospace;">
        <h2 style="text-align:center;">A4-PRINT</h2>
        <h3 style="text-align:center;">БЛАНК ПРИЁМА №${r.id}</h3><hr>
        <p><strong>Дата:</strong> ${r.date}</p>
        <p><strong>Клиент:</strong> ${r.client}</p>
        <p><strong>Телефон:</strong> ${r.phone || '_______________'}</p><hr>
        <p><strong>Оборудование:</strong> ${r.equipment}</p>
        <p><strong>Модель:</strong> ${r.model || '_______________'}</p>
        <p><strong>SN:</strong> ${r.serial || '_______________'}</p>
        <p><strong>Неисправность:</strong> ${r.issue || '_______________'}</p>
        <p><strong>Комплектация:</strong> ${r.accessories || '_______________'}</p><hr>
        <p><strong>Стоимость:</strong> ${r.cost} ₽</p><hr>
        <p>_________________________  _________________________</p>
        <p style="text-align:center;">Подпись клиента           Подпись мастера</p>
    </div>`;
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>Бланк приёма</title><style>body{font-family:monospace;padding:20px;}</style></head><body>' + html + '</body></html>');
    w.document.close(); w.print();
    closePrintModal();
}

function printIssue() {
    if (!selectedRepairId) { alert('❌ Выберите ремонт!'); return; }
    const r = repairs.find(r => r.id === selectedRepairId);
    if (!r) return;
    const html = `<div style="max-width:500px;margin:0 auto;font-family:monospace;">
        <h2 style="text-align:center;">A4-PRINT</h2>
        <h3 style="text-align:center;">АКТ ВЫДАЧИ №${r.id}</h3><hr>
        <p><strong>Дата выдачи:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        <p><strong>Клиент:</strong> ${r.client}</p><hr>
        <p><strong>Оборудование:</strong> ${r.equipment}</p>
        <p><strong>Модель:</strong> ${r.model || '_______________'}</p>
        <p><strong>SN:</strong> ${r.serial || '_______________'}</p><hr>
        <p><strong>Работы:</strong> ${r.issue || '_______________'}</p>
        <p><strong>Стоимость:</strong> ${r.cost} ₽</p>
        <p><strong>Оплачено:</strong> ${r.cost} ₽</p><hr>
        <p><strong>Комплектация получена:</strong> ${r.accessories || 'в полном объёме'}</p><hr>
        <p>_________________________  _________________________</p>
        <p style="text-align:center;">Подпись клиента           Подпись мастера</p>
        <p style="text-align:center;font-size:12px;">ПРЕТЕНЗИЙ НЕТ. ОБОРУДОВАНИЕ ПОЛУЧИЛ.</p>
    </div>`;
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>Акт выдачи</title><style>body{font-family:monospace;padding:20px;}</style></head><body>' + html + '</body></html>');
    w.document.close(); w.print();
    r.status = 'Выдано';
    saveRepairs();
    renderRepairsList();
    closePrintModal();
}

function refreshRepairsList() { loadRepairs(); renderRepairsList(); }
function exportRepairs() {
    let csv = "№,ДАТА,КЛИЕНТ,ТЕЛЕФОН,ОБОРУДОВАНИЕ,МОДЕЛЬ,НЕИСПРАВНОСТЬ,СТОИМОСТЬ,СТАТУС\n";
    repairs.forEach(r => { csv += `${r.id},${r.date},${r.client},${r.phone},${r.equipment},${r.model},${r.issue},${r.cost},${r.status}\n`; });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "a4print_repairs.csv";
    link.click();
}

function showServiceStats() {
    const total = repairs.length;
    const completed = repairs.filter(r => r.status === 'Выдано').length;
    const income = repairs.filter(r => r.status === 'Выдано').reduce((s, r) => s + r.cost, 0);
    alert(`📊 СТАТИСТИКА\n\nВсего: ${total}\nВыполнено: ${completed}\nВ работе: ${total - completed}\nДоход: ${income.toLocaleString()} ₽`);
}

initService();
