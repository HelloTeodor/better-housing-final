// Get container
const listContainer = document.getElementById("submissionsList");

// Fetch all submissions
async function loadSubmissions() {
  try {
    const res = await fetch("/api/getCompanies");
    if (!res.ok) throw new Error("Failed to fetch submissions");

    const data = await res.json();

    listContainer.innerHTML = ""; // clear

    data.forEach((submit) => {
      // Create a card for each company
      const card = document.createElement("div");
      card.className = "border p-4 rounded shadow";

      // Company name as clickable header
      const header = document.createElement("div");
      header.className = "cursor-pointer font-semibold";
      header.textContent = submit.companyName || "Unnamed Company";

      // Details container (hidden by default)
      const details = document.createElement("div");
      details.className = "mt-2 hidden flex-col gap-1";

      for (const [key, value] of Object.entries(submit)) {
        if (key === "_id") continue; // skip Mongo ID
        const p = document.createElement("p");
        p.textContent = `${key}: ${value}`;
        details.appendChild(p);
      }

      // Toggle details on click
      header.addEventListener("click", () => {
        details.classList.toggle("hidden");
      });

      card.appendChild(header);
      card.appendChild(details);
      listContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    listContainer.textContent = "Error loading submissions.";
  }
}

// Load submissions on page load
loadSubmissions();
