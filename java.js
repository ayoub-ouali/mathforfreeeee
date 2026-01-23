// تفعيل القائمة المتنقلة على الأجهزة الصغيرة
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ JavaScript يعمل!');
    
    // 1. القائمة المتنقلة
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // 2. تفعيل أزرار عرض التفاصيل
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', function() {
            const cardDetails = this.previousElementSibling;
            const isActive = cardDetails.classList.contains('active');
            
            // إغلاق جميع البطاقات الأخرى
            document.querySelectorAll('.card-details.active').forEach(detail => {
                if (detail !== cardDetails) {
                    detail.classList.remove('active');
                    const btn = detail.nextElementSibling;
                    if (btn) {
                        btn.textContent = 'عرض التفاصيل';
                        btn.style.backgroundColor = 'transparent';
                        btn.style.color = '#4a6bff';
                    }
                }
            });
            
            // تبديل الحالة الحالية
            cardDetails.classList.toggle('active');
            
            if (!isActive) {
                this.textContent = 'إخفاء التفاصيل';
                this.style.backgroundColor = '#4a6bff';
                this.style.color = 'white';
            } else {
                this.textContent = 'عرض التفاصيل';
                this.style.backgroundColor = 'transparent';
                this.style.color = '#4a6bff';
            }
        });
    });
    
    // 3. الآلة الحاسبة - الإصلاح الكامل
    class Calculator {
        constructor() {
            this.previousOperand = '';
            this.currentOperand = '0';
            this.operation = undefined;
            this.display = document.getElementById('display');
            this.previousDisplay = document.querySelector('.previous-operation');
            
            console.log('آلة حاسبة جاهزة!');
            this.init();
        }
        
        init() {
            // ربط جميع أزرار الآلة الحاسبة
            document.querySelectorAll('.calc-btn').forEach(button => {
                button.addEventListener('click', () => {
                    console.log('زر مضغوط:', button.textContent);
                    
                    const action = button.getAttribute('data-action');
                    const number = button.getAttribute('data-number');
                    
                    if (number !== null) {
                        this.appendNumber(number);
                    } else if (action !== null) {
                        this.handleAction(action);
                    }
                    
                    this.updateDisplay();
                });
            });
            
            // إضافة دعم لوحة المفاتيح
            document.addEventListener('keydown', (event) => {
                this.handleKeyboard(event);
            });
        }
        
        appendNumber(number) {
            console.log('إضافة رقم:', number);
            
            if (number === '.' && this.currentOperand.includes('.')) {
                return;
            }
            
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand += number;
            }
            
            // إضافة تأثير مرئي
            this.addButtonEffect(number);
        }
        
        handleAction(action) {
            console.log('إجراء:', action);
            
            switch(action) {
                case 'clear':
                    this.clear();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                case 'percentage':
                    this.percentage();
                    break;
                case 'divide':
                    this.setOperation('÷');
                    break;
                case 'multiply':
                    this.setOperation('×');
                    break;
                case 'subtract':
                    this.setOperation('−');
                    break;
                case 'add':
                    this.setOperation('+');
                    break;
                case 'equals':
                    this.calculate();
                    break;
            }
            
            // إضافة تأثير مرئي
            this.addButtonEffect(action);
        }
        
        setOperation(op) {
            if (this.currentOperand === '') return;
            
            if (this.previousOperand !== '') {
                this.calculate();
            }
            
            this.operation = op;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }
        
        calculate() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '−':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            
            // إضافة تأثير للنتيجة
            this.display.style.color = '#4CAF50';
            setTimeout(() => {
                this.display.style.color = 'white';
            }, 500);
        }
        
        clear() {
            this.currentOperand = '0';
            this.previousOperand = '';
            this.operation = undefined;
            
            // تأثير المسح
            this.display.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.display.style.transform = 'scale(1)';
            }, 200);
        }
        
        backspace() {
            if (this.currentOperand.length === 1) {
                this.currentOperand = '0';
            } else {
                this.currentOperand = this.currentOperand.slice(0, -1);
            }
        }
        
        percentage() {
            if (this.currentOperand !== '0') {
                this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
            }
        }
        
        updateDisplay() {
            this.display.textContent = this.currentOperand;
            
            if (this.operation != null) {
                this.previousDisplay.textContent = 
                    `${this.previousOperand} ${this.operation}`;
            } else {
                this.previousDisplay.textContent = '';
            }
            
            console.log('الشاشة:', this.currentOperand);
        }
        
        addButtonEffect(value) {
            const button = document.querySelector(`[data-number="${value}"]`) || 
                          document.querySelector(`[data-action="${value}"]`);
            
            if (button) {
                button.style.transform = 'scale(0.9)';
                button.style.opacity = '0.8';
                
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                    button.style.opacity = '1';
                }, 150);
            }
        }
        
        handleKeyboard(event) {
            const key = event.key;
            console.log('مفتاح:', key);
            
            if ((key >= '0' && key <= '9') || key === '.') {
                this.appendNumber(key);
                this.updateDisplay();
            } else if (key === '+') {
                this.setOperation('+');
                this.updateDisplay();
            } else if (key === '-') {
                this.setOperation('−');
                this.updateDisplay();
            } else if (key === '*') {
                this.setOperation('×');
                this.updateDisplay();
            } else if (key === '/') {
                event.preventDefault();
                this.setOperation('÷');
                this.updateDisplay();
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                this.calculate();
                this.updateDisplay();
            } else if (key === 'Escape') {
                this.clear();
                this.updateDisplay();
            } else if (key === 'Backspace') {
                this.backspace();
                this.updateDisplay();
            } else if (key === '%') {
                this.percentage();
                this.updateDisplay();
            }
        }
    }
    
    // إنشاء الآلة الحاسبة فقط إذا كانت موجودة في الصفحة
    const calculatorDisplay = document.getElementById('display');
    if (calculatorDisplay) {
        const calculator = new Calculator();
        
        // إضافة تأثيرات مرئية
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.3)';
            });
            
            btn.addEventListener('mouseup', () => {
                btn.style.boxShadow = '';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.boxShadow = '';
            });
        });
        
        // عرض رسالة ترحيب
        console.log('🎮 الآلة الحاسبة جاهزة! جرب:');
        console.log('• 5 + 3 =');
        console.log('• 10 × 2 =');
        console.log('• يمكنك استخدام لوحة المفاتيح أيضاً!');
    }
    
    // 4. التنقل السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 5. تأثيرات إضافية
    // إضافة تأثير للبطاقات عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مراقبة البطاقات
    document.querySelectorAll('.branch-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // 6. زر فتح راسم الدوال
    const graphBtn = document.getElementById('graph-btn');
    if (graphBtn) {
        graphBtn.addEventListener('click', function() {
            alert('🚀 سيتم فتح راسم الدوال قريباً!\n\nميزات متوقعة:\n• رسم دوال رياضية\n• تحليل النتائج\n• حفظ الرسومات\n\nجرب الآلة الحاسبة أولاً 😊');
            
            // تأثير للزر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // 7. رسالة ترحيب عند فتح الكونسول
    console.log('%c🎯 موقع الرياضيات - JavaScript مفعل!', 
        'color: #4a6bff; font-size: 16px; font-weight: bold;');
    console.log('%c▶ جرب الآلة الحاسبة بالضغط على الأرقام', 
        'color: #4CAF50; font-size: 14px;');
    
    // 8. مؤشر تفاعل مع الشاشة
    const style = document.createElement('style');
    style.textContent = `
        .click-effect {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid #4a6bff;
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // إضافة تأثير النقر
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('calc-btn')) {
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            effect.style.left = (e.pageX - 10) + 'px';
            effect.style.top = (e.pageY - 10) + 'px';
            document.body.appendChild(effect);
            
            setTimeout(() => {
                effect.remove();
            }, 600);
        }
    });
});