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
    document.getElementById('repairModel').value = repair.model
