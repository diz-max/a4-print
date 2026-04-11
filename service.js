let repairs = [];

function initService() {
    loadRepairs();
    renderRepairs();
}

function loadRepairs() {
    const saved = localStorage.getItem('service_repairs');
    if (saved) {
        repairs = JSON.parse(saved);
    } else {
        repairs = [];
    }
}

function saveRepairs() {
    localStorage.setItem('service_repairs', JSON.stringify(repairs));
}

function addRepair() {
    document.getElementById('repairModal').style.display = 'flex';
    document.getElementById('repairForm').reset();
}

function closeRepairModal() {
    document.getElementById('repairModal').style.display = 'none';
}

document.getElementById('repairForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const repair = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        client: document.getElementById('repairClient').value,
        phone: document.getElementById('repairPhone').value,
        equipment: document.getElementById('repairEquipment').value,
        model: document.getElementById('repairModel').value,
        serial: document.getElementById('repairSerial').value,
        issue: document.getElementById('repairIssue').value,
        accessories: document.getElementById('repairAccessories').value,
        cost: parseFloat(document.getElementById('repairCost').value),
        status: document.getElementById('repairStatus').value,
        note: document.getElementById('repairNote').value
    };
    
    repairs.unshift(repair);
    saveRepairs();
    renderRepairs();
    closeRepairModal();
});

function renderRepairs() {
    const tbody = document.getElementById('repairsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    repairs.forEach(repair => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = repair.id;
        row.insertCell(1).textContent = repair.date;
        row.insertCell(2).textContent = repair.client;
        row.insertCell(3).textContent = repair.phone;
        row.insertCell(4).textContent = repair.equipment;
        row.insertCell(5).textContent = repair.model;
        row.insertCell(6).textContent = repair.issue;
        row.insertCell(7).textContent = repair.cost + ' ₽';
        row.insertCell(8).textContent = repair.status;
        
        const actionCell = row.insertCell(9);
        
        const printAcceptBtn = document.createElement('button');
        printAcceptBtn.textContent = '📄';
        printAcceptBtn.className = 'print-btn';
        printAcceptBtn.title = 'Печать бланка приёма';
        printAcceptBtn.onclick = () => printAcceptanceBlankById(repair.id);
        actionCell.appendChild(printAcceptBtn);
        
        const printIssueBtn = document.createElement('button');
        printIssueBtn.textContent = '📋';
        printIssueBtn.className = 'print-btn';
        printIssueBtn.title = 'Печать бланка выдачи';
        printIssueBtn.onclick = () => printIssueBlankById(repair.id);
        actionCell.appendChild(printIssueBtn);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.className = 'delete-btn';
        editBtn.onclick = () => editRepair(repair.id);
        actionCell.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.style.marginLeft = '5px';
        deleteBtn.onclick = () => deleteRepair(repair.id);
        actionCell.appendChild(deleteBtn);
    });
}

function editRepair(id) {
    const repair = repairs.find(r => r.id === id);
    if (!repair) return;
    
    document.getElementById('repairClient').value = repair.client;
    document.getElementById('repairPhone').value = repair.phone;
    document.getElementById('repairEquipment').value = repair.equipment;
    document.getElementById('repairModel').value = repair.model;
    document.getElementById('repairSerial').value = repair.serial;
    document.getElementById('repairIssue').value = repair.issue;
    document.getElementById('repairAccessories').value = repair.accessories;
    document.getElementById('repairCost').value = repair.cost;
    document.getElementById('repairStatus').value = repair.status;
    document.getElementById('repairNote').value = repair.note;
    
    document.getElementById('repairModal').style.display = 'flex';
    
    const form = document.getElementById('repairForm');
    const oldSubmit = form.onsubmit;
    form.onsubmit = function(e) {
        e.preventDefault();
        repair.client = document.getElementById('repairClient').value;
        repair.phone = document.getElementById('repairPhone').value;
        repair.equipment = document.getElementById('repairEquipment').value;
        repair.model = document.getElementById('repairModel').value;
        repair.serial = document.getElementById('repairSerial').value;
        repair.issue = document.getElementById('repairIssue').value;
        repair.accessories = document.getElementById('repairAccessories').value;
        repair.cost = parseFloat(document.getElementById('repairCost').value);
        repair.status = document.getElementById('repairStatus').value;
        repair.note = document.getElementById('repairNote').value;
        saveRepairs();
        renderRepairs();
        closeRepairModal();
        form.onsubmit = oldSubmit;
    };
}

function deleteRepair(id) {
    if (confirm('Удалить ремонт?')) {
        repairs = repairs.filter(r => r.id !== id);
        saveRepairs();
        renderRepairs();
    }
}

function saveData() {
    saveRepairs();
    alert('✅ Данные сохранены!');
}

// ПЕЧАТЬ БЛАНКА ПРИЁМА
function printAcceptanceBlank() {
    const selectedRow = document.querySelector('#repairsBody tr');
    if (!selectedRow) {
        alert('❌ Выберите ремонт для печати!');
        return;
    }
    const id = parseInt(selectedRow.cells[0].textContent);
    printAcceptanceBlankById(id);
}

function printAcceptanceBlankById(id) {
    const repair = repairs.find(r => r.id === id);
    if (!repair) return;
    
    const blankHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial; padding: 20px;">
            <h2 style="text-align: center; color: #0056B3;">СЕРВИСНЫЙ ЦЕНТР</h2>
            <h3 style="text-align: center;">БЛАНК ПРИЁМА ОБОРУДОВАНИЯ</h3>
            <hr>
            <p><strong>№ заказа:</strong> ${repair.id}</p>
            <p><strong>Дата приёма:</strong> ${repair.date}</p>
            <p><strong>Клиент:</strong> ${repair.client}</p>
            <p><strong>Телефон:</strong> ${repair.phone || '_______________'}</p>
            <hr>
            <p><strong>Оборудование:</strong> ${repair.equipment}</p>
            <p><strong>Модель:</strong> ${repair.model || '_______________'}</p>
            <p><strong>Серийный номер:</strong> ${repair.serial || '_______________'}</p>
            <p><strong>Неисправность:</strong> ${repair.issue || '_______________'}</p>
            <p><strong>Комплектация:</strong> ${repair.accessories || '_______________'}</p>
            <hr>
            <p><strong>Стоимость ремонта:</strong> ${repair.cost} ₽</p>
            <p><strong>Статус:</strong> ${repair.status}</p>
            <p><strong>Примечание:</strong> ${repair.note || '_______________'}</p>
            <hr>
            <p style="margin-top: 30px;">_________________________  _________________________</p>
            <p style="text-align: center;">Подпись клиента           Подпись мастера</p>
            <p style="text-align: center; font-size: 12px;">СПАСИБО ЗА ОБРАЩЕНИЕ!</p>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Бланк приёма</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(blankHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// ПЕЧАТЬ БЛАНКА ВЫДАЧИ
function printIssueBlank() {
    const selectedRow = document.querySelector('#repairsBody tr');
    if (!selectedRow) {
        alert('❌ Выберите ремонт для печати!');
        return;
    }
    const id = parseInt(selectedRow.cells[0].textContent);
    printIssueBlankById(id);
}

function printIssueBlankById(id) {
    const repair = repairs.find(r => r.id === id);
    if (!repair) return;
    
    const issueDate = new Date().toLocaleDateString('ru-RU');
    
    const blankHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial; padding: 20px;">
            <h2 style="text-align: center; color: #28a745;">СЕРВИСНЫЙ ЦЕНТР</h2>
            <h3 style="text-align: center;">АКТ ВЫДАЧИ ОБОРУДОВАНИЯ ИЗ РЕМОНТА</h3>
            <hr>
            <p><strong>№ заказа:</strong> ${repair.id}</p>
            <p><strong>Дата приёма:</strong> ${repair.date}</p>
            <p><strong>Дата выдачи:</strong> ${issueDate}</p>
            <p><strong>Клиент:</strong> ${repair.client}</p>
            <hr>
            <p><strong>Оборудование:</strong> ${repair.equipment}</p>
            <p><strong>Модель:</strong> ${repair.model || '_______________'}</p>
            <p><strong>Серийный номер:</strong> ${repair.serial || '_______________'}</p>
            <hr>
            <p><strong>Выполненные работы:</strong> ${repair.issue || '_______________'}</p>
            <p><strong>Стоимость ремонта:</strong> ${repair.cost} ₽</p>
            <p><strong>Оплачено:</strong> ${repair.cost} ₽</p>
            <hr>
            <p><strong>Комплектация выдана:</strong> ${repair.accessories || 'в полном объёме'}</p>
            <hr>
            <p style="margin-top: 30px;">_________________________  _________________________</p>
            <p style="text-align: center;">Подпись клиента           Подпись мастера</p>
            <p style="text-align: center; font-size: 12px;">ПРЕТЕНЗИЙ НЕТ. ОБОРУДОВАНИЕ ПОЛУЧИЛ.</p>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Бланк выдачи</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(blankHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    
    // Обновляем статус на "Выдано"
    repair.status = 'Выдано';
    saveRepairs();
    renderRepairs();
}

function showRepairStats() {
    const total = repairs.length;
    const completed = repairs.filter(r => r.status === 'Выдано').length;
    const income = repairs.filter(r => r.status === 'Выдано').reduce((sum, r) => sum + r.cost, 0);
    
    alert(`📊 СТАТИСТИКА СЕРВИСНОГО ЦЕНТРА\n\n` +
          `Всего ремонтов: ${total}\n` +
          `Выполнено: ${completed}\n` +
          `В работе: ${total - completed}\n` +
          `Доход: ${income.toLocaleString()} ₽`);
}

function exportRepairsToExcel() {
    let csv = "№,ДАТА,КЛИЕНТ,ТЕЛЕФОН,ОБОРУДОВАНИЕ,МОДЕЛЬ,НЕИСПРАВНОСТЬ,СТОИМОСТЬ,СТАТУС\n";
    repairs.forEach(repair => {
        csv += `${repair.id},${repair.date},${repair.client},${repair.phone},${repair.equipment},${repair.model},${repair.issue},${repair.cost},${repair.status}\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ремонты.csv";
    link.click();
}

initService();
