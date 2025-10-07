let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

document.getElementById("addBtn").addEventListener("click", () => {
  const name = document.getElementById("itemName").value.trim();
  const quantity = parseInt(document.getElementById("itemQuantity").value);
  const price = parseFloat(document.getElementById("itemPrice").value);

  document.getElementById("logoutBtn").addEventListener("click", function() {
    if (confirm("Logout from system?")) {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = 0;
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "login.html";
      }, 500);
    }
  });

  if (name === "" || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
    alert("Please enter valid item name, quantity, and price.");
    return;
  }

  const dateAdded = new Date().toLocaleDateString();

  const existingItem = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    inventory.push({ name, quantity, price, total: quantity * price, dateAdded });
  }

  saveData();
  updateTable();
  clearInputs();
});

function updateTable() {
  const table = document.getElementById("inventoryTable");
  const totalValueElem = document.getElementById("totalValue");
  table.innerHTML = "";

  let totalValue = 0;

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = item.quantity <= 5 ? "low-stock" : "";

    totalValue += item.total;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.total.toFixed(2)}</td>
      <td>${item.dateAdded}</td>
      <td>
        <button onclick="decrease(${index})">Use</button>
        <button onclick="deleteItem(${index})">Remove</button>
      </td>
    `;
    table.appendChild(row);
  });

  totalValueElem.textContent = totalValue.toFixed(2);
}

function decrease(index) {
  if (inventory[index].quantity > 0) {
    inventory[index].quantity--;
    inventory[index].total = inventory[index].quantity * inventory[index].price;
  }

  if (inventory[index].quantity === 0) {
    alert(`${inventory[index].name} is out of stock!`);
  } else if (inventory[index].quantity <= 5) {
    alert(`${inventory[index].name} stock is low (${inventory[index].quantity} left)!`);
  }

  saveData();
  updateTable();
}

function deleteItem(index) {
  if (confirm(`Delete ${inventory[index].name}?`)) {
    inventory.splice(index, 1);
    saveData();
    updateTable();
  }
}

function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemPrice").value = "";
}

function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Load inventory when page starts
updateTable();
