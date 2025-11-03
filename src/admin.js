const listContainer = document.getElementById("submissionsList");

async function loadSubmissions() {
  try {
    const res = await fetch("/api/getCompanies"); // make sure case matches your API
    if (!res.ok) throw new Error("Failed to fetch submissions");

    const data = await res.json();
    listContainer.innerHTML = "";

    data.forEach((submit) => {
      // Card container
      const card = document.createElement("div");
      card.className = "border rounded-md shadow-sm p-4 bg-white flex flex-col";

      // Header row: company name + button
      const header = document.createElement("div");
      header.className = "flex justify-between items-center";

      const nameEl = document.createElement("span");
      nameEl.textContent = submit.companyName || "Unnamed Company";
      nameEl.className = "font-semibold text-lg text-gray-800";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "Show More";
      toggleBtn.className =
        "text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition";

      header.appendChild(nameEl);
      header.appendChild(toggleBtn);

      // Details panel (hidden by default)
      const details = document.createElement("div");
      details.className = "mt-2 hidden flex-col gap-1 text-gray-700";

      for (const [key, value] of Object.entries(submit)) {
        if (key === "_id") continue; // skip Mongo ID
        const p = document.createElement("p");
        p.innerHTML = `<span class="font-semibold">${key}:</span> ${value}`;
        details.appendChild(p);
      }

      // Toggle button functionality
      toggleBtn.addEventListener("click", () => {
        details.classList.toggle("hidden");
        toggleBtn.textContent = details.classList.contains("hidden")
          ? "Show More"
          : "Show Less";
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

loadSubmissions();
