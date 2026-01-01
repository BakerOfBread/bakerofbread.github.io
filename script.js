function generateReference() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BREAD-${y}${m}${d}-${rand}`;
}

const form = document.getElementById("orderForm");
const orderRef = document.getElementById("orderRef");
const successBox = document.getElementById("successBox");
const errorBox = document.getElementById("errorBox");
const refText = document.getElementById("refText");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  errorBox.hidden = true;

  const ref = generateReference();
  orderRef.value = ref;

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
    form.reset();

    window.scrollTo({
      top: successBox.offsetTop - 20,
      behavior: "smooth"
    });
  } catch (err) {
    errorBox.hidden = false;
  }
});
