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
        issue: document.getElementById('repairIssue').value,
        cost: parseFloat(document.getElementById('repairCost').value),
        status: document.getElementById('repairStatus').value
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
    document.getElementById('repairIssue').value = repair.issue;
    document.getElementById('repairCost').value = repair.cost;
    document.getElementById('repairStatus').value = repair.status;
    
    document.getElementById('repairModal').style.display = 'flex';
    
    const form = document.getElementById('repairForm');
    const oldSubmit = form.onsubmit;
    form.onsubmit = function(e) {
        e.preventDefault();
        repair.client = document.getElementById('repairClient').value;
        repair.phone = document.getElementById('repairPhone').value;
        repair.equipment = document.getElementById('repairEquipment').value;
        repair.model = document.getElementById('repairModel').value;
        repair.issue = document.getElementById('repairIssue').value;
        repair.cost = parseFloat(document.getElementById('repairCost').value);
        repair.status = document.getElementById('repairStatus').value;
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

function printBlank() {
    const selectedRow = document.querySelector('#repairsBody tr');
    if (!selectedRow) {
        alert('❌ Выберите ремонт для печати!');
        return;
    }
    
    const cells = selectedRow.cells;
    document.getElementById('blankNum').textContent = cells[0].textContent;
    document.getElementById('blankDate').textContent = cells[1].textContent;
    document.getElementById('blankClient').textContent = cells[2].textContent;
    document.getElementById('blankPhone').textContent = cells[3].textContent;
    document.getElementById('blankEquipment').textContent = cells[4].textContent;
    document.getElementById('blankModel').textContent = cells[5].textContent;
    document.getElementById('blankIssue').textContent = cells[6].textContent;
    document.getElementById('blankCost').textContent = cells[7].textContent.replace(' ₽', '');
    document.getElementById('blankStatus').textContent = cells[8].textContent;
    
    const printContent = document.getElementById('blankContent').innerHTML;
    const originalTitle = document.title;
    document.title = 'Квитанция';
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Квитанция</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;} h2{color:#0056B3;} .blank{max-width:600px;margin:0 auto;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="blank">' + printContent + '</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    document.title = originalTitle;
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

initService();
