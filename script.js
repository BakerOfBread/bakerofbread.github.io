function generateReference() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BREAD-${y}${m}${d}-${rand}`;
}

/* Prices must match checkbox value strings exactly */
const PRICE_MAP = {
  "Country sourdough – full": 14.00,
  "Country sourdough – half": 9.00,
  "Rye – full": 15.00,
  "Rye – half": 9.50,
  "Cinnamon swirl – full": 16.00,
  "Cinnamon swirl – half": 10.00,
  "Pumpernickel – full": 15.00,
  "Pumpernickel – half": 9.50,
  "Wheat – full": 14.00,
  "Wheat – half": 9.00,
  "White – full": 13.50,
  "White – half": 8.50,
  "Seeded multigrain – full": 15.00,
  "Seeded multigrain – half": 9.50,
  "Jalapeño cheddar – full": 17.00,
  "Jalapeño cheddar – half": 10.00,
  "Rosemary olive oil – full": 15.00,
  "Rosemary olive oil – half": 9.50,

  "Soft breadsticks (6-pack)": 10.00,
  "Hard breadsticks (12-pack)": 9.50,

  "Veggie savory bites": 16.00,
  "Veggie heat bites": 16.50,
  "Veggie sweet heat bites": 16.50,
  "Pepperoni bites": 17.50,
  "Three cheese bites": 17.50,
  "Steak bites": 19.00,

  "Sausage veggie mornin muffins": 15.00,
  "Egg and cheeses mornin muffins": 14.50,
  "Cheese mornin muffins": 14.00,

  "Banana nut cake bread bites": 15.50,
  "Lemon poppy cake bread bites": 15.00,
  "Chocolate chip cake bread bites": 16.00,
  "Cinnamon streusel cake bread bites": 15.50,

  "Heritage sourdough starter pouch": 10.00
};

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function getCheckedItems() {
  return Array.from(document.querySelectorAll('input[name="items[]"]:checked'));
}

function calculateTotal() {
  const checked = getCheckedItems();
  let total = 0;

  for (const box of checked) {
    const key = box.value;
    const price = PRICE_MAP[key];

    if (typeof price === "number") {
      total += price;
    }
  }

  return total;
}

/* Elements */
const form = document.getElementById("orderForm");
const orderRef = document.getElementById("orderRef");
const successBox = document.getElementById("successBox");
const errorBox = document.getElementById("errorBox");
const refText = document.getElementById("refText");

const orderTotalEl = document.getElementById("orderTotal");
const orderTotalInput = document.getElementById("orderTotalInput");
const payRefEl = document.getElementById("payRef");

function updateTotalUI() {
  const total = calculateTotal();
  orderTotalEl.textContent = formatMoney(total);
  orderTotalInput.value = total.toFixed(2);
}

/* Update total whenever a checkbox changes */
document.addEventListener("change", function (e) {
  if (e.target && e.target.matches('input[name="items[]"]')) {
    updateTotalUI();
  }
});

/* Initialize on load */
updateTotalUI();

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  errorBox.hidden = true;

  /* Require at least one item */
  const checked = getCheckedItems();
  if (checked.length === 0) {
    errorBox.hidden = false;
    errorBox.textContent = "Please select at least one item.";
    return;
  }

  /* Generate reference at submission time */
  const ref = generateReference();
  orderRef.value = ref;

  /* Show reference in payment section as well */
  payRefEl.textContent = ref;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    refText.textContent = ref;
    successBox.hidden = false;

    /* Keep total visible, reset checkboxes and other fields */
    form.reset();
    updateTotalUI();

    window.scrollTo({
      top: successBox.offsetTop - 20,
      behavior: "smooth"
    });
  } catch (err) {
    errorBox.hidden = false;
    errorBox.textContent = "Submission failed. Please try again or contact me directly.";
  }
});
