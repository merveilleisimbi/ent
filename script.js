
let items = JSON.parse(localStorage.getItem("beadBloomItems")) || [];

const form = document.getElementById("stockForm");
const inventory = document.getElementById("inventory");

function saveData() {
    localStorage.setItem("beadBloomItems", JSON.stringify(items));
}

function getStatus(item) {
    if (item.quantity === 0) {
        return "out";
    }

    if (item.quantity <= item.threshold) {
        return "medium";
    }

    return "full";
}

function displayItems() {

    inventory.innerHTML = "";

    let full = 0;
    let medium = 0;
    let out = 0;

    const search = document.getElementById("search")
        .value.toLowerCase();

    items.forEach((item, index) => {

        const status = getStatus(item);

        if (status === "full") full++;
        if (status === "medium") medium++;
        if (status === "out") out++;

        if (!item.name.toLowerCase().includes(search)) {
            return;
        }

        const div = document.createElement("div");
        div.className = "item";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const category = document.createElement("p");
        category.textContent = "Category: " + item.category;

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        const badge = document.createElement("span");
        badge.className = "status " + status;

        badge.textContent =
            status === "full" ? "FULL STOCK" :
            status === "medium" ? "MEDIUM STOCK" :
            "OUT OF STOCK";

        const editButton = document.createElement("button");
        editButton.className = "edit";
        editButton.textContent = "Edit";
        editButton.onclick = () => editItem(index);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteItem(index);

        div.append(title, category, quantity, badge,
                   document.createElement("br"),
                   editButton, deleteButton);

        inventory.appendChild(div);
    });

    document.getElementById("fullCount").textContent = full;
    document.getElementById("mediumCount").textContent = medium;
    document.getElementById("outCount").textContent = out;
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("itemName")
        .value.trim();

    const category = document.getElementById("category").value;

    const quantity = Number(
        document.getElementById("quantity").value
    );

    const threshold = Number(
        document.getElementById("threshold").value
    );

    if (!name || !Number.isInteger(quantity) ||
        quantity < 0 || !Number.isInteger(threshold) ||
        threshold < 1) {
        alert("Please enter valid stock information.");
        return;
    }

    if (items.some(item =>
        item.name.toLowerCase() === name.toLowerCase())) {
        alert("This item already exists. Please edit it instead.");
        return;
    }

    items.push({
        name,
        category,
        quantity,
        threshold
    });

    saveData();
    displayItems();

    form.reset();

    alert("Item added successfully!");
});

function editItem(index) {

    const item = items[index];

    const newQuantity = prompt(
        "Enter the new quantity:", item.quantity
    );

    if (newQuantity === null || newQuantity.trim() === "") {
        return;
    }

    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
        alert("Please enter a valid whole number.");
        return;
    }

    items[index].quantity = quantity;

    saveData();
    displayItems();
}

function deleteItem(index) {

    if (confirm("Are you sure you want to delete this item?")) {
        items.splice(index, 1);

        saveData();
        displayItems();
    }
}

document.getElementById("search")
    .addEventListener("input", displayItems);

displayItems();
