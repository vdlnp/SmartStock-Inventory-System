let inventory = [];

document.getElementById("addBtn").addEventListener("click", () => {
  const name = document.getElementById("itemName").value.trim();
  const quantity = parseInt(document.getElementById("itemQuantity").value);

  if (name === "" || isNaN(quantity) || quantity < 0) {
    alert("Please enter valid item name and quantity.");
    return;
  }

  const existingItem = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    inventory.push({ name, quantity });
  }

  updateTable();
  clearInputs();
});

function updateTable() {
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = item.quantity <= 5 ? "low-stock" : "";

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>
        <button onclick="decrease(${index})">Use</button>
        <button onclick="deleteItem(${index})">Remove</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function decrease(index) {
  if (inventory[index].quantity > 0) {
    inventory[index].quantity--;
  }

  if (inventory[index].quantity === 0) {
    alert(`${inventory[index].name} is out of stock!`);
  } else if (inventory[index].quantity <= 5) {
    alert(`${inventory[index].name} stock is low (${inventory[index].quantity} left)!`);
  }

  updateTable();
}

function deleteItem(index) {
  if (confirm(`Delete ${inventory[index].name}?`)) {
    inventory.splice(index, 1);
    updateTable();
  }
}

function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
}
