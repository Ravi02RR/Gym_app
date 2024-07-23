import html2pdf from 'html2pdf.js';

export const downloadPDF = (planType, userInfo, planContent) => {
    const element = document.createElement('div');

    element.innerHTML = `
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 6px;
                line-height: 1.2;
                color: #333;
            }
            h1 { font-size: 10px; color: #4f46e5; margin: 4px 0; }
            h2 { font-size: 8px; color: #4f46e5; margin: 3px 0; }
            h3 { font-size: 7px; color: #4f46e5; margin: 2px 0; }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 4px;
                font-size: 5px;
            }
            th, td {
                border: 0.5px solid #ddd;
                padding: 1px;
                text-align: left;
            }
            th { background-color: #f2f2f2; }
            .user-info {
                display: flex;
                flex-wrap: wrap;
                gap: 2px;
                margin-bottom: 4px;
                font-size: 6px;
            }
            .user-info p { margin: 0; flex-basis: calc(33% - 2px); }
            ul, ol { margin: 2px 0; padding-left: 10px; }
            li { margin-bottom: 1px; }
        </style>
        <h1>${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan for ${userInfo.name}</h1>
        <div class="user-info">
            <p><strong>Age:</strong> ${userInfo.age}</p>
            <p><strong>Height:</strong> ${userInfo.height} cm</p>
            <p><strong>Weight:</strong> ${userInfo.weight} kg</p>
            <p><strong>Gender:</strong> ${userInfo.gender}</p>
            <p><strong>Diet Type:</strong> ${userInfo.dietType}</p>
            <p><strong>Goal:</strong> ${userInfo.goal}</p>
        </div>
        <div class="plan-content">
            ${planContent}
        </div>`;

    html2pdf().from(element).set({
        margin: [2, 2, 2, 2],
        filename: `${userInfo.name}_${planType}_plan.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: [297, 420], orientation: 'portrait' }, // A3 size
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).save();
};
