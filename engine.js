// داخل دالة setupEvents() أضف الربط لكل المحاور:

function setupEvents() {
    // مصفوفة بكل أنواع التحويلات لتقليل تكرار الكود
    const transforms = [
        { id: 'pos-x', prop: 'position', axis: 'x' },
        { id: 'pos-y', prop: 'position', axis: 'y' },
        { id: 'pos-z', prop: 'position', axis: 'z' },
        { id: 'rot-x', prop: 'rotation', axis: 'x' },
        { id: 'rot-y', prop: 'rotation', axis: 'y' },
        { id: 'rot-z', prop: 'rotation', axis: 'z' },
        { id: 'scale-x', prop: 'scale', axis: 'x' },
        { id: 'scale-y', prop: 'scale', axis: 'y' },
        { id: 'scale-z', prop: 'scale', axis: 'z' }
    ];

    transforms.forEach(t => {
        const el = document.getElementById(t.id);
        el.oninput = (e) => {
            if (selectedObject) {
                selectedObject[t.prop][t.axis] = parseFloat(e.target.value);
                // تحديث نص القيمة بجانب الـ slider إذا وجد
                const valDisplay = document.getElementById(`val-${t.id}`);
                if (valDisplay) valDisplay.innerText = e.target.value;
            }
        };
    });
    
    // ... باقي الكود الخاص بالشمس والاستيراد ...
}
