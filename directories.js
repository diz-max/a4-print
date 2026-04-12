<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>A4-Print | Настройки</title>
    <link rel="icon" type="image/png" href="images/logo_mini_a4_print.png">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app">
        <header class="header">
            <div class="header-left">
                <div class="logo">
                    <img src="images/logo_mini_a4_print.png" alt="A4-Print" class="logo-img">
                    <span>A4-PRINT</span>
                </div>
            </div>
            <div class="header-right">
                <button class="back-btn" onclick="window.location.href='index.html'">← НАЗАД</button>
            </div>
        </header>

        <div class="directories-container">
            <div class="directories-grid">
                <!-- УСЛУГИ -->
                <div class="directory-card">
                    <div class="directory-header">
                        <h2>📋 УСЛУГИ И ЦЕНЫ</h2>
                        <button onclick="addService()">➕ ДОБАВИТЬ</button>
                    </div>
                    <div class="directory-list" id="servicesList"></div>
                </div>

                <!-- СОТРУДНИКИ -->
                <div class="directory-card">
                    <div class="directory-header">
                        <h2>👥 СОТРУДНИКИ</h2>
                        <button onclick="addEmployee()">➕ ДОБАВИТЬ</button>
                    </div>
                    <div class="directory-list" id="employeesList"></div>
                </div>
            </div>
        </div>

        <footer class="footer">
            <button class="footer-btn" onclick="saveAllDirectories()">💾 СОХРАНИТЬ ВСЁ</button>
            <button class="footer-btn" onclick="resetToDefault()">🔄 СБРОСИТЬ</button>
        </footer>
    </div>

    <script src="directories.js"></script>
</body>
</html>
