// script.js
document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("addItemBtn");
  const itemsContainer = document.getElementById("itemsContainer");
  const receiptForm = document.getElementById("receiptForm");
  const receiptOutputContainer = document.getElementById(
    "receiptOutputContainer"
  );
  const receiptPreview = document.getElementById("receiptPreview");
  const printReceiptBtn = document.getElementById("printReceiptBtn");

  // 表单输入元素
  const restaurantNameInput = document.getElementById("restaurantName");
  const restaurantAddressInput = document.getElementById("restaurantAddress");
  const restaurantPhoneInput = document.getElementById("restaurantPhone");
  const receiptDateInput = document.getElementById("receiptDate");
  const receiptTimeInput = document.getElementById("receiptTime");
  const currencySelect = document.getElementById("currency");

  const subtotalInput = document.getElementById("subtotal");
  const taxRateInput = document.getElementById("taxRate");
  const taxAmountInput = document.getElementById("taxAmount");
  const tipAmountInput = document.getElementById("tipAmount");
  const totalAmountInput = document.getElementById("totalAmount");
  const receiptNotesInput = document.getElementById("receiptNotes");

  // 初始化日期和时间为当前值
  function initializeDateTime() {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    if (receiptDateInput && !receiptDateInput.value)
      receiptDateInput.value = `${YYYY}-${MM}-${DD}`;
    if (receiptTimeInput && !receiptTimeInput.value)
      receiptTimeInput.value = `${hh}:${mm}`;
  }
  initializeDateTime();

  // 设置页脚当前年份
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  // 创建新的项目行
  function createItemRow() {
    const itemRow = document.createElement("div");
    itemRow.classList.add("item-row");
    itemRow.innerHTML = `
            <input type="text" placeholder="项目名称" class="item-name" required>
            <input type="number" placeholder="数量" class="item-qty" value="1" min="0.01" step="any" required>
            <input type="number" placeholder="单价" class="item-price" step="0.01" min="0" required>
            <button type="button" class="remove-item-btn">移除</button>
        `;
    // 移除按钮事件
    itemRow
      .querySelector(".remove-item-btn")
      .addEventListener("click", function () {
        itemRow.remove();
        calculateTotals();
      });

    // 为新行中的输入框添加事件监听以实时计算总额
    itemRow
      .querySelectorAll("input.item-qty, input.item-price")
      .forEach((input) => {
        input.addEventListener("input", calculateTotals);
      });
    return itemRow;
  }

  // 添加项目按钮事件
  if (addItemBtn) {
    addItemBtn.addEventListener("click", function () {
      const newItemRow = createItemRow();
      itemsContainer.appendChild(newItemRow);
      // 新添加的行中的数量和价格输入框也需要事件监听
      newItemRow
        .querySelectorAll("input.item-qty, input.item-price")
        .forEach((input) => {
          input.addEventListener("input", calculateTotals);
        });
      calculateTotals(); // 添加新行后重新计算
    });
  }

  // 为已存在的项目行中的输入框添加事件监听
  function addListenersToExistingRows() {
    itemsContainer.querySelectorAll(".item-row").forEach((row) => {
      row
        .querySelectorAll("input.item-qty, input.item-price")
        .forEach((input) => {
          input.addEventListener("input", calculateTotals);
        });
      const removeBtn = row.querySelector(".remove-item-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          row.remove();
          calculateTotals();
        });
      }
    });
  }
  addListenersToExistingRows();

  // 计算总额
  function calculateTotals() {
    let subtotal = 0;
    const itemRows = itemsContainer.querySelectorAll(".item-row");
    itemRows.forEach((row) => {
      const qtyInput = row.querySelector(".item-qty");
      const priceInput = row.querySelector(".item-price");
      const qty = parseFloat(qtyInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      subtotal += qty * price;
    });

    subtotalInput.value = subtotal.toFixed(2);

    const taxRate = parseFloat(taxRateInput.value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    taxAmountInput.value = taxAmount.toFixed(2);

    const tip = parseFloat(tipAmountInput.value) || 0;

    const total = subtotal + taxAmount + tip;
    totalAmountInput.value = total.toFixed(2);
  }

  // 为税率和小费输入框添加事件监听
  if (taxRateInput) taxRateInput.addEventListener("input", calculateTotals);
  if (tipAmountInput) tipAmountInput.addEventListener("input", calculateTotals);

  // 页面加载时进行一次初始计算 (如果表单有预填值)
  calculateTotals();

  // 表单提交事件 - 生成收据预览
  if (receiptForm) {
    receiptForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 阻止表单默认提交行为
      if (
        typeof receiptForm.checkValidity === "function" &&
        !receiptForm.checkValidity()
      ) {
        // 如果浏览器支持HMTL5验证API并且表单无效
        receiptForm.reportValidity(); // 显示验证错误信息
        return;
      }
      generateReceiptPreview();
      receiptOutputContainer.style.display = "block";
      receiptPreview.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // 生成收据预览的HTML内容
  function formatCurrency(amount, symbol) {
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  }

  function generateReceiptPreview() {
    const currencySymbol = currencySelect.value;
    const name = restaurantNameInput.value || "您的餐厅名称";
    const address = restaurantAddressInput.value || "餐厅地址";
    const phone = restaurantPhoneInput.value || "联系电话";
    const date = receiptDateInput.value;
    const time = receiptTimeInput.value;

    let previewHTML = `
            <h3>${name}</h3>
            ${address ? `<p>${address}</p>` : ""}
            ${phone ? `<p>${phone}</p>` : ""}
            <p>日期: ${date} 时间: ${time}</p>
            <hr>
            <div class="item-line header">
                <span><strong>项目</strong></span>
                <span><strong>数量</strong></span>
                <span><strong>金额</strong></span>
            </div>
            <hr>
        `;

    const itemRows = itemsContainer.querySelectorAll(".item-row");
    itemRows.forEach((row) => {
      const itemName = row.querySelector(".item-name").value || "未命名项目";
      const itemQty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const itemPrice = parseFloat(row.querySelector(".item-price").value) || 0;
      const itemTotal = itemQty * itemPrice;
      previewHTML += `
                <div class="item-line">
                    <span>${itemName}</span>
                    <span>${itemQty}</span>
                    <span>${itemTotal.toFixed(2)}</span>
                </div>
            `;
    });

    previewHTML += `<hr>`;
    previewHTML += `<div class="totals-section">`;
    previewHTML += `<p><span>小计:</span> <span>${formatCurrency(
      subtotalInput.value,
      currencySymbol
    )}</span></p>`;

    const taxVal = parseFloat(taxAmountInput.value);
    if (taxVal > 0) {
      previewHTML += `<p><span>税额 (${
        taxRateInput.value
      }%):</span> <span>${formatCurrency(taxVal, currencySymbol)}</span></p>`;
    }
    const tipVal = parseFloat(tipAmountInput.value);
    if (tipVal > 0) {
      previewHTML += `<p><span>小费:</span> <span>${formatCurrency(
        tipVal,
        currencySymbol
      )}</span></p>`;
    }
    previewHTML += `<p class="total-highlight"><strong><span>总计:</span> <span>${formatCurrency(
      totalAmountInput.value,
      currencySymbol
    )}</span></strong></p>`;
    previewHTML += `</div>`;

    const notes = receiptNotesInput.value.trim();
    if (notes) {
      previewHTML += `<hr><p style="text-align:center; font-style:italic;">${notes.replace(
        /\n/g,
        "<br>"
      )}</p>`;
    } else {
      previewHTML += `<hr><p style="text-align:center;">谢谢惠顾!</p>`;
    }

    receiptPreview.innerHTML = previewHTML;
  }

  // 打印收据按钮事件
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", function () {
      window.print(); // 使用浏览器的打印功能
    });
  }
});
