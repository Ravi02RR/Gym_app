import html2pdf from 'html2pdf.js';

export const downloadPDF = (planType, userInfo, planContent) => {
    const element = document.createElement('div');

    element.innerHTML = `
        <style>
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.6;
                color: #000;
                background-color: #fff;
            }
            h1 { 
                font-size: 24px; 
                color: #000; 
                margin: 20px 0; 
                text-align: center; 
            }
            h2 { 
                font-size: 20px; 
                color: #000; 
                margin: 15px 0; 
            }
            h3 { 
                font-size: 18px; 
                color: #000; 
                margin: 10px 0; 
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                font-size: 12px;
            }
            th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            th { 
                background-color: #f2f2f2; 
                font-weight: bold; 
            }
            .user-info {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
                font-size: 14px;
                background-color: #fff;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .user-info p { 
                margin: 0; 
                flex-basis: calc(33% - 10px);
                padding: 10px;
                border-radius: 5px;
                background-color: #f9f9f9;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            ul, ol { 
                margin: 10px 0; 
                padding-left: 20px; 
            }
            li { 
                margin-bottom: 5px; 
            }
            .plan-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                margin-bottom: 20px;
            }
            .block {
                margin-bottom: 20px;
            }
            .table-container {
                overflow-x: auto;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 12px;
                text-align: left;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
                color: black;
            }
        </style>
        <h1>${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan for ${userInfo.name}</h1>
        <div class="user-info block">
            <p><strong>Age:</strong> ${userInfo.age}</p>
            <p><strong>Height:</strong> ${userInfo.height} cm</p>
            <p><strong>Weight:</strong> ${userInfo.weight} kg</p>
            <p><strong>Gender:</strong> ${userInfo.gender}</p>
            <p><strong>Diet Type:</strong> ${userInfo.dietType}</p>
            <p><strong>Goal:</strong> ${userInfo.goal}</p>
        </div>
        <div class="plan-content block table-container">
            ${planContent}
        </div>`;

    html2pdf().from(element).set({
        margin: [15, 15, 15, 15],
        filename: `${userInfo.name}_${planType}_plan.pdf`,
        html2canvas: { scale: 2, backgroundColor: '#fff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }).save();
};
