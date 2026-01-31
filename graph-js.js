// ============ المتغيرات العامة ============
let functions = [];
let currentExpression = '';
let plotLayout = null;
let currentTab = 'graphing';
let isEditMode = false;
let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

// ألوان الدوال
const functionColors = [
    '#0078d4', '#107c10', '#d83b01', '#e3008c',
    '#8661c5', '#00bcf2', '#ffb900', '#737373'
];

// معدلات التحويل
const conversionRates = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
};

// ============ تهيئة التطبيق ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting Windows Calculator Pro...');
    
    // 1. بناء لوحة المفاتيح
    buildKeyboard();
    
    // 2. تهيئة الرسم البياني
    initGraph();
    
    // 3. تحميل التاريخ المحفوظ
    loadHistory();
    
    // 4. إضافة دوال مثال
    setTimeout(addSampleFunctions, 1000);
    
    // 5. تحويل الوحدات الأولي
    convertUnits();
    
    console.log('✅ Calculator ready!');
    updateStatus('Ready - Enter a function');
});

// ============ بناء لوحة المفاتيح ============
function buildKeyboard() {
    const keypad = document.getElementById('calculatorKeypad');
    keypad.innerHTML = '';
    
    const keys = [
        // الصف 1: العمليات الخاصة
        { text: '(', class: 'operation', action: () => addToInput('(') },
        { text: ')', class: 'operation', action: () => addToInput(')') },
        { text: 'π', class: 'scientific', action: () => addToInput('π') },
        { text: 'e', class: 'scientific', action: () => addToInput('e') },
        { text: 'C', class: 'operation', action: clearFunction },
        
        // الصف 2: الدوال الأساسية
        { text: 'sin', class: 'scientific', action: () => addToInput('sin(') },
        { text: 'cos', class: 'scientific', action: () => addToInput('cos(') },
        { text: 'tan', class: 'scientific', action: () => addToInput('tan(') },
        { text: '√', class: 'scientific', action: () => addToInput('sqrt(') },
        { text: 'x²', class: 'scientific', action: () => addToInput('^2') },
        
        // الصف 3: الدوال المتقدمة
        { text: 'ln', class: 'scientific', action: () => addToInput('ln(') },
        { text: 'log', class: 'scientific', action: () => addToInput('log10(') },
        { text: 'eˣ', class: 'scientific', action: () => addToInput('exp(') },
        { text: '|x|', class: 'scientific', action: () => addToInput('abs(') },
        { text: 'mod', class: 'scientific', action: () => addToInput('mod ') },
        
        // الصف 4: الأرقام
        { text: '7', class: 'number', action: () => addToInput('7') },
        { text: '8', class: 'number', action: () => addToInput('8') },
        { text: '9', class: 'number', action: () => addToInput('9') },
        { text: '÷', class: 'operation', action: () => addToInput('/') },
        { text: '⌫', class: 'operation', action: deleteLastChar },
        
        // الصف 5: الأرقام
        { text: '4', class: 'number', action: () => addToInput('4') },
        { text: '5', class: 'number', action: () => addToInput('5') },
        { text: '6', class: 'number', action: () => addToInput('6') },
        { text: '×', class: 'operation', action: () => addToInput('*') },
        { text: 'x', class: 'number', action: () => addToInput('x') },
        
        // الصف 6: الأرقام
        { text: '1', class: 'number', action: () => addToInput('1') },
        { text: '2', class: 'number', action: () => addToInput('2') },
        { text: '3', class: 'number', action: () => addToInput('3') },
        { text: '-', class: 'operation', action: () => addToInput('-') },
        { text: '.', class: 'number', action: () => addToInput('.') },
        
        // الصف 7: العمليات
        { text: '0', class: 'number', action: () => addToInput('0') },
        { text: 'xⁿ', class: 'scientific', action: () => addToInput('^') },
        { text: '+', class: 'operation', action: () => addToInput('+') },
        { text: '=', class: 'equals', action: plotFunction },
        { text: '±', class: 'operation', action: () => addToInput('-') }
    ];
    
    keys.forEach(key => {
        const button = document.createElement('button');
        button.className = `calc-btn ${key.class}`;
        button.textContent = key.text;
        button.onclick = key.action;
        keypad.appendChild(button);
    });
}

// ============ تهيئة الرسم البياني ============


function initGraph() {
    console.log('📊 Initializing graph...');
    
    plotLayout = {
        title: { 
            text: 'Function Graph', 
            font: { size: 16, color: '#323130' } 
        },
        xaxis: {
            title: { 
                text: 'x-axis', 
                font: { size: 14, color: '#605e5c' } 
            },
            showgrid: true,
            zeroline: true,
            gridcolor: '#f0f0f0',
            zerolinecolor: '#8a8886',
            range: [-10, 10], // ⭐ رجعت المدى الأصلي
            showline: true,
            linecolor: '#323130',
            linewidth: 2
        },
        yaxis: {
            title: { 
                text: 'y-axis', 
                font: { size: 14, color: '#605e5c' } 
            },
            showgrid: true,
            zeroline: true,
            gridcolor: '#f0f0f0',
            zerolinecolor: '#8a8886',
            range: [-10, 10], // ⭐ رجعت المدى الأصلي
            showline: true,
            linecolor: '#323130',
            linewidth: 2
        },
        showlegend: true,
        legend: {
            x: 1.02,
            y: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            bordercolor: '#e1dfdd',
            borderwidth: 1
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { l: 80, r: 40, t: 60, b: 80 },
        // ⭐ أبقي هذه فقط (لا تغير شيئاً آخر)
        dragmode: 'pan',
        scrollZoom: true
    };
    
    Plotly.newPlot('graph', [], plotLayout, {
        displayModeBar: true,
        displaylogo: false,
        scrollZoom: true, // ⭐ هذا مهم للتكبير
        responsive: true
    });
    
    console.log('✅ Graph initialized successfully');
}


    // تحديث إحداثيات الماوس
    document.getElementById('graph').on('plotly_hover', function(data) {
        if (data.points && data.points[0]) {
            document.getElementById('coordX').textContent = data.points[0].x.toFixed(3);
            document.getElementById('coordY').textContent = data.points[0].y.toFixed(3);
        }
    });

// ============ إضافة نص إلى المدخل ============
function addToInput(text) {
    const input = document.getElementById('functionInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    currentExpression = input.value.substring(0, start) + text + input.value.substring(end);
    input.value = currentExpression;
    input.focus();
    input.setSelectionRange(start + text.length, start + text.length);
    
    updateStatus('Entering: ' + currentExpression);
}

// ============ حذف آخر حرف ============
function deleteLastChar() {
    const input = document.getElementById('functionInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    if (start === end && start > 0) {
        currentExpression = input.value.substring(0, start - 1) + input.value.substring(end);
        input.value = currentExpression;
        input.setSelectionRange(start - 1, start - 1);
    } else if (start !== end) {
        currentExpression = input.value.substring(0, start) + input.value.substring(end);
        input.value = currentExpression;
        input.setSelectionRange(start, start);
    }
    
    input.focus();
}

// ============ مسح الدالة ============
function clearFunction() {
    document.getElementById('functionInput').value = '';
    currentExpression = '';
    updateStatus('Cleared');
    showNotification('Input cleared');
}

// ============ رسم الدالة ============
function plotFunction() {
    const input = document.getElementById('functionInput');
    const expression = input.value.trim();
    
    if (!expression) {
        showNotification('Please enter a function first');
        updateStatus('Error: No function entered');
        return;
    }
    
    if (!isValidExpression(expression)) {
        showNotification('Invalid mathematical expression');
        updateStatus('Error: Invalid expression');
        return;
    }
    
    updateStatus('Plotting: ' + expression);
    showNotification('Calculating function...');
    
    // إضافة الدالة
    addFunction(expression);
    
    // حفظ في التاريخ
    addToHistory('Plotted: ' + expression);
    
    // مسح المدخل
    input.value = '';
    currentExpression = '';
}

// ============ التحقق من صحة التعبير ============
function isValidExpression(expr) {
    if (!expr.trim()) return false;
    
    try {
        const testExpr = expr
            .replace(/π/g, 'pi')
            .replace(/√/g, 'sqrt')
            .replace(/\^/g, '^');
        
        const scope = { x: 1, pi: Math.PI, e: Math.E };
        const result = math.evaluate(testExpr, scope);
        
        return typeof result === 'number' && !isNaN(result);
    } catch (error) {
        return false;
    }
}

// ============ إضافة دالة جديدة ============
function addFunction(expression) {
    const color = functionColors[functions.length % functionColors.length];
    const name = `f${functions.length + 1}(x)`;
    
    const func = {
        id: Date.now(),
        name: name,
        expression: expression,
        color: color,
        visible: true,
        points: calculatePoints(expression)
    };
    
    functions.push(func);
    updateFunctionsList();
    updateGraph();
    
    showNotification(`Added: ${name}`);
    updateStatus(`Active functions: ${functions.length}`);
}

// ============ حساب نقاط الدالة ============
function calculatePoints(expression) {
    const points = [];
    const step = 0.1;
    
    for (let x = -10; x <= 10; x += step) {
        try {
            const expr = expression
                .replace(/π/g, 'pi')
                .replace(/√/g, 'sqrt')
                .replace(/\^/g, '^');
            
            const scope = { x: x, pi: Math.PI, e: Math.E };
            const y = math.evaluate(expr, scope);
            
            if (typeof y === 'number' && !isNaN(y)) {
                points.push({ x: x, y: y });
            }
        } catch (error) {
            // تجاهل النقاط غير الصالحة
        }
    }
    
    return points;
}

// ============ تحديث الرسم البياني ============
function updateGraph() {
    const traces = [];
    
    functions.forEach(func => {
        if (func.visible && func.points.length > 0) {
            const xValues = func.points.map(p => p.x);
            const yValues = func.points.map(p => p.y);
            
            traces.push({
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                name: `${func.name}: ${func.expression}`,
                line: { color: func.color, width: 2 }
            });
        }
    });
    
    document.getElementById('funcCount').textContent = functions.length;
    Plotly.react('graph', traces, plotLayout);
}

// ============ تحديث قائمة الدوال ============
// ============ دالة تحديث قائمة الدوال مع خاصية الإخفاء ============
function updateFunctionsList() {
    const list = document.getElementById('functionsList');
    if (!list) return;
    
    if (functions.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #666;">
                <i class="fas fa-function" style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;"></i>
                <div>No functions added yet</div>
                <div style="font-size: 12px; margin-top: 5px;">Enter a function above</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    
    functions.forEach((func, index) => {
        const div = document.createElement('div');
        div.className = 'function-card';
        div.style.opacity = func.visible ? '1' : '0.6';
        div.style.borderLeft = `4px solid ${func.color}`;
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                <div class="func-color" style="background: ${func.color}; 
                    width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                </div>
                
                <div class="func-info" style="flex: 1; min-width: 0;">
                    <div class="func-name" style="font-weight: 600; font-size: 14px; color: #323130; 
                        display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span>${func.name}</span>
                        <span style="font-size: 11px; color: ${func.visible ? '#107c10' : '#d83b01'}; 
                            background: ${func.visible ? 'rgba(16, 124, 16, 0.1)' : 'rgba(216, 59, 1, 0.1)'}; 
                            padding: 2px 8px; border-radius: 10px;">
                            ${func.visible ? 'Visible' : 'Hidden'}
                        </span>
                    </div>
                    <div class="func-expr" style="font-family: 'Consolas', monospace; font-size: 13px; 
                        color: #605e5c; word-break: break-all;">
                        ${func.expression}
                    </div>
                </div>
                
                <div class="func-actions" style="display: flex; gap: 6px;">
                    <button class="action-btn" onclick="toggleFunctionVisibility(${index})" 
                        title="${func.visible ? 'Hide function' : 'Show function'}"
                        style="background: ${func.visible ? '#f3f2f1' : '#e6f3ff'}; 
                               color: ${func.visible ? '#605e5c' : '#0078d4'};">
                        <i class="fas ${func.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button class="action-btn" onclick="editFunction(${index})" title="Edit function"
                        style="background: #fff4ce; color: #ffb900;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="removeFunction(${index})" title="Remove function"
                        style="background: #ffe6e6; color: #d83b01;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
    
    // تحديث العنوان
    const title = document.querySelector('#functionsPanel h3');
    if (title) {
        const visibleCount = functions.filter(f => f.visible).length;
        title.innerHTML = `Graph Functions <span style="font-size: 14px; color: #0078d4; margin-left: 10px;">
            (${visibleCount}/${functions.length} visible)
        </span>`;
    }
}

// ============ التحكم في الدوال ============
function toggleFunction(index) {
    functions[index].visible = !functions[index].visible;
    updateFunctionsList();
    updateGraph();
    
    const action = functions[index].visible ? 'shown' : 'hidden';
    showNotification(`Function ${functions[index].name} ${action}`);
}

function removeFunction(index) {
    if (confirm(`Remove ${functions[index].name}?`)) {
        functions.splice(index, 1);
        updateFunctionsList();
        updateGraph();
        showNotification('Function removed');
    }
}

// ============ إضافة دالة جديدة من نافذة ============
function addNewFunction() {
    const func = prompt('Enter a function (e.g., x^2, sin(x), 2*x+1):');
    if (func && func.trim()) {
        document.getElementById('functionInput').value = func.trim();
        plotFunction();
    }
}

// ============ تحويل وضع التحرير ============
function toggleEditMode() {
    const input = document.getElementById('functionInput');
    const btn = document.getElementById('editBtn');
    
    if (!isEditMode) {
        // تفعيل وضع التحرير
        input.focus();
        input.select();
        btn.innerHTML = '<i class="fas fa-check"></i> Done';
        btn.style.background = '#107c10';
        isEditMode = true;
        showNotification('Edit mode activated - Type directly');
    } else {
        // تعطيل وضع التحرير
        btn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        btn.style.background = '';
        isEditMode = false;
        showNotification('Edit mode deactivated');
    }
}

// ============ أدوات الرسم البياني ============
function zoomIn() {
    plotLayout.xaxis.range[0] *= 0.8;
    plotLayout.xaxis.range[1] *= 0.8;
    plotLayout.yaxis.range[0] *= 0.8;
    plotLayout.yaxis.range[1] *= 0.8;
    updateGraph();
    showNotification('Zoomed in');
}

function zoomOut() {
    plotLayout.xaxis.range[0] *= 1.2;
    plotLayout.xaxis.range[1] *= 1.2;
    plotLayout.yaxis.range[0] *= 1.2;
    plotLayout.yaxis.range[1] *= 1.2;
    updateGraph();
    showNotification('Zoomed out');
}

function resetView() {
    // ⭐ يعيد إلى المدى القريب الأصلي (ليس البعيد)
    Plotly.relayout('graph', {
        'xaxis.range': [-5, 5],
        'yaxis.range': [-5, 5]
    });
    showNotification('Reset to close view [-5, 5]');
}
function exportGraph() {
    Plotly.downloadImage('graph', {
        format: 'png',
        width: 1200,
        height: 800,
        filename: 'function_graph'
    });
    showNotification('Graph exported as PNG');
}

// ============ التبديل بين التبويبات الرئيسية ============
function switchMainTab(tabName) {
    currentTab = tabName;
    
    // تحديث التبويبات النشطة
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.main-tab').forEach(tab => {
        if (tab.textContent.includes(tabName.charAt(0).toUpperCase() + tabName.slice(1))) {
            tab.classList.add('active');
        }
    });
    
    // إظهار المحتوى المناسب
    switch(tabName) {
        case 'graphing':
            showNotification('Switched to Graphing mode');
            break;
        case 'scientific':
            showNotification('Scientific mode - Coming soon');
            break;
        case 'formulas':
            switchSidebarTab('formulas');
            break;
        case 'converter':
            switchSidebarTab('converter');
            break;
        case 'history':
            switchSidebarTab('history');
            break;
    }
}

// ============ التبديل بين تبويبات القائمة الجانبية ============
function switchSidebarTab(tabName) {
    // تحديث التبويبات النشطة
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        if (tab.onclick.toString().includes(tabName)) {
            tab.classList.add('active');
        }
    });
    
    // إظهار المحتوى المناسب
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Panel').classList.add('active');
}

// ============ إدراج صيغة رياضية ============
function insertFormula(formula) {
    const input = document.getElementById('functionInput');
    input.value = formula;
    input.focus();
    showNotification('Formula inserted');
    updateStatus('Formula: ' + formula);
}

// ============ تحويل الوحدات ============
function convertUnits() {
    const value = parseFloat(document.getElementById('convValue').value);
    const fromUnit = document.getElementById('convFrom').value;
    const toUnit = document.getElementById('convTo').value;
    
    if (isNaN(value)) {
        document.getElementById('convResult').textContent = 'Invalid input';
        return;
    }
    
    // التحويل إلى متر ثم إلى الوحدة المطلوبة
    const valueInMeters = value * conversionRates[fromUnit];
    const result = valueInMeters / conversionRates[toUnit];
    
    document.getElementById('convResult').textContent = result.toFixed(6) + ' ' + toUnit;
    
    // حفظ في التاريخ
    addToHistory(`${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`);
}

// ============ نظام التاريخ ============
function addToHistory(item) {
    calculationHistory.unshift({
        id: Date.now(),
        text: item,
        time: new Date().toLocaleTimeString()
    });
    
    // حفظ آخر 50 عنصر
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    
    // حفظ في localStorage
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    
    // تحديث العرض
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('historyList');
    
    if (calculationHistory.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No history yet</div>';
        return;
    }
    
    list.innerHTML = '';
    
    calculationHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div>${item.text}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${item.time}</div>
        `;
        div.onclick = function() {
            loadFromHistory(item.text);
        };
        list.appendChild(div);
    });
}

function loadFromHistory(text) {
    // استخراج الدالة من النص إذا كان يحتوي على "Plotted: "
    const match = text.match(/Plotted:\s*(.+)/);
    if (match && match[1]) {
        document.getElementById('functionInput').value = match[1];
        showNotification('Loaded from history');
    } else {
        document.getElementById('functionInput').value = text;
        showNotification('Loaded from history');
    }
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        calculationHistory = [];
        localStorage.removeItem('calcHistory');
        loadHistory();
        showNotification('History cleared');
    }
}

// ============ دوال مساعدة ============
function addSampleFunctions() {
    if (functions.length > 0) return;
    
    const samples = [
        'x^2',
        'sin(x)',
        'cos(x)',
        '2*x + 1'
    ];
    
    samples.forEach((sample, i) => {
        setTimeout(() => {
            addFunction(sample);
        }, i * 500);
    });
    
    showNotification('Sample functions added');
}

function updateStatus(message) {
    document.getElementById('statusMessage').textContent = message;
}

function showNotification(message) {
    // استخدام الدالة الموجودة في HTML
    if (typeof window.showNotification === 'function') {
        window.showNotification(message);
    } else {
        // نسخة احتياطية
        console.log('Notification:', message);
    }
}

// ============ تهيئة النهاية ============
console.log('✅ Windows Calculator Pro initialized successfully!');




        // ============ دوال التحكم في الإخفاء والإظهار ============

// تبديل رؤية دالة محددة
function toggleFunctionVisibility(index) {
    if (index >= 0 && index < functions.length) {
        functions[index].visible = !functions[index].visible;
        updateFunctionsList();
        updateGraph();
        showNotification(`${functions[index].name} ${functions[index].visible ? 'shown' : 'hidden'}`);
        saveFunctions();
    }
}

// إخفاء جميع الدوال
function hideAllFunctions() {
    if (functions.length === 0) {
        showNotification('No functions to hide');
        return;
    }
    
    functions.forEach(func => func.visible = false);
    updateFunctionsList();
    updateGraph();
    showNotification('All functions hidden');
    saveFunctions();
}

// إظهار جميع الدوال
function showAllFunctions() {
    if (functions.length === 0) {
        showNotification('No functions to show');
        return;
    }
    
    functions.forEach(func => func.visible = true);
    updateFunctionsList();
    updateGraph();
    showNotification('All functions shown');
    saveFunctions();
}

// تبديل الدوال حسب النوع
function toggleFunctionsByType(type) {
    const types = {
        'trigonometric': ['sin', 'cos', 'tan'],
        'polynomial': ['^'],
        'linear': ['*x', 'x+', 'x-'],
        'exponential': ['exp', 'e^']
    };
    
    const keywords = types[type] || [];
    const filtered = functions.filter(func => 
        keywords.some(keyword => func.expression.includes(keyword))
    );
    
    if (filtered.length === 0) {
        showNotification(`No ${type} functions found`);
        return;
    }
    
    const allHidden = filtered.every(f => !f.visible);
    filtered.forEach(func => {
        const index = functions.findIndex(f => f.id === func.id);
        if (index !== -1) functions[index].visible = allHidden;
    });
    
    updateFunctionsList();
    updateGraph();
    showNotification(`${allHidden ? 'Shown' : 'Hidden'} ${type} functions`);
    saveFunctions();
}

     // ============ إضافة أزرار التحكم في الواجهة ============
function addVisibilityControls() {
    let controlsContainer = document.getElementById('visibilityControls');
    
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'visibilityControls';
        controlsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        `;
        
        const functionsPanel = document.getElementById('functionsPanel');
        if (functionsPanel) {
            functionsPanel.appendChild(controlsContainer);
        }
    }
    
    controlsContainer.innerHTML = `
        <button class="ctrl-btn" onclick="showAllFunctions()" 
                style="background: #e6f3ff; color: #0078d4; padding: 8px 12px; border-radius: 6px; border: 1px solid #e1dfdd; cursor: pointer;">
            <i class="fas fa-eye"></i> Show All
        </button>
        <button class="ctrl-btn" onclick="hideAllFunctions()" 
                style="background: #ffe6e6; color: #d83b01; padding: 8px 12px; border-radius: 6px; border: 1px solid #e1dfdd; cursor: pointer;">
            <i class="fas fa-eye-slash"></i> Hide All
        </button>
        <button class="ctrl-btn" onclick="toggleFunctionsByType('trigonometric')"
                style="background: #fff4ce; color: #ffb900; padding: 8px 12px; border-radius: 6px; border: 1px solid #e1dfdd; cursor: pointer;">
            <i class="fas fa-wave-square"></i> Toggle Trig
        </button>
        <button class="ctrl-btn" onclick="toggleFunctionsByType('polynomial')"
                style="background: #e6ffed; color: #107c10; padding: 8px 12px; border-radius: 6px; border: 1px solid #e1dfdd; cursor: pointer;">
            <i class="fas fa-chart-line"></i> Toggle Poly
        </button>
    `;
}

     // ============ تهيئة خاصية الإخفاء/الإظهار ============
function initVisibilitySystem() {
    // تأكد من أن كل دالة لها خاصية visible
    functions.forEach(func => {
        if (func.visible === undefined) {
            func.visible = true;
        }
    });
    
    // تحديث الواجهة
    updateFunctionsList();
    
    // إضافة أزرار التحكم بعد تأخير بسيط
    setTimeout(() => {
        addVisibilityControls();
    }, 100);
    
    console.log('✅ Visibility system initialized');
}

// ============ استدعاء التهيئة ============
// أضف هذا في نهاية كودك أو في DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initVisibilitySystem, 500);
});










function initGraph() {
    console.log('📊 Initializing graph...');
    
    plotLayout = {
        title: { 
            text: 'Function Graph', 
            font: { size: 16, color: '#323130' } 
        },
        xaxis: {
            title: { 
                text: 'x-axis', 
                font: { size: 14, color: '#605e5c' } 
            },
            showgrid: true,
            zeroline: true,
            gridcolor: '#f0f0f0',
            zerolinecolor: '#8a8886',
            range: [-10, 10], // ⭐ رجعت المدى الأصلي
            showline: true,
            linecolor: '#323130',
            linewidth: 2
        },
        yaxis: {
            title: { 
                text: 'y-axis', 
                font: { size: 14, color: '#605e5c' } 
            },
            showgrid: true,
            zeroline: true,
            gridcolor: '#f0f0f0',
            zerolinecolor: '#8a8886',
            range: [-10, 10], // ⭐ رجعت المدى الأصلي
            showline: true,
            linecolor: '#323130',
            linewidth: 2
        },
        showlegend: true,
        legend: {
            x: 1.02,
            y: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            bordercolor: '#e1dfdd',
            borderwidth: 1
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { l: 80, r: 40, t: 60, b: 80 },
        // ⭐ أبقي هذه فقط (لا تغير شيئاً آخر)
        dragmode: 'pan',
        scrollZoom: true
    };
    
    Plotly.newPlot('graph', [], plotLayout, {
        displayModeBar: true,
        displaylogo: false,
        scrollZoom: true, // ⭐ هذا مهم للتكبير
        responsive: true
    });
    
    console.log('✅ Graph initialized successfully');
}