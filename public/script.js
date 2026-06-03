
    const productSelect = document.getElementById('product');
    const depthBox = document.getElementById('depthBox');

    productSelect.addEventListener('change', handleProductChange);
    handleProductChange();

    function selectProduct(productKey) {
      productSelect.value = productKey;
      handleProductChange();
      document.getElementById('calculatorCard').scrollIntoView({ behavior: 'smooth' });
    }

    function handleProductChange() {
      const product = productSelect.value;

      if (product === 'fa_tok') {
        depthBox.classList.remove('hidden');
      } else {
        depthBox.classList.add('hidden');
      }
    }

    async function calculate() {
      const product = document.getElementById('product').value;
      const width = Number(document.getElementById('width').value);
      const height = Number(document.getElementById('height').value);
      const depth = Number(document.getElementById('depth').value);
      const motor = document.getElementById('motor').value;
      const controller = document.getElementById('controller').value;
      const extra = document.getElementById('extra').value;
      const extraAmount = Number(document.getElementById('extraAmount').value);
      const gross = document.getElementById('gross').value === 'true';

      const payload = {
        product,
        width,
        height,
        depth,
        motor,
        controller,
        extra,
        extraAmount,
        gross
      };

      try {
       const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify(payload)
      });

        const data = await response.json();

        if (!response.ok) {
          showError(data.error || 'Ismeretlen hiba történt.');
          return;
        }

        showResult(data);
      } catch (error) {
        showError('Nem sikerült kapcsolódni a szerverhez. Ellenőrizd, hogy fut-e a server.js.');
      }
    }

    function showResult(data) {
      const output = document.getElementById('output');

      const linesHtml = data.lines.map((line) => `
        <tr>
          <td>${line.name}</td>
          <td>${line.type}</td>
          <td>${line.quantity}</td>
          <td>${line.unit_price}</td>
          <td>${line.total}</td>
        </tr>
      `).join('');

      output.innerHTML = `
        <div class="result">
          <strong>Termék:</strong> ${data.product}<br>
          ${data.note ? `<strong>Megjegyzés:</strong> ${data.note}<br>` : ''}

          <table class="line-table">
            <thead>
              <tr>
                <th>Tétel</th>
                <th>Típus</th>
                <th>Mennyiség</th>
                <th>Egységár</th>
                <th>Összeg</th>
              </tr>
            </thead>
            <tbody>
              ${linesHtml}
            </tbody>
          </table>

          <div class="summary">
            <strong>Nettó ár:</strong> ${data.net_price}<br>
            <strong>ÁFA:</strong> ${data.vat_price}<br>
            <strong>Bruttó ár:</strong> ${data.gross_price}<br>
            <strong>Megjelenített végösszeg:</strong> ${data.final_price} (${data.price_mode})
          </div>
        </div>
      `;
    }

    function showError(message) {
      const output = document.getElementById('output');

      output.innerHTML = `
        <div class="error">
          ${message}
        </div>
      `;
    }

    function resetForm() {
      document.getElementById('width').value = '';
      document.getElementById('height').value = '';
      document.getElementById('depth').value = '';
      document.getElementById('motor').value = '';
      document.getElementById('controller').value = '';
      document.getElementById('extra').value = '';
      document.getElementById('extraAmount').value = '';
      document.getElementById('gross').value = 'false';
      document.getElementById('output').innerHTML = '';
      handleProductChange();
    }
  