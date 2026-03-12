// admin.js
const submissionsList = document.getElementById("submissionsList");

export async function loadSubmissions() {
  if (!submissionsList) return;
  submissionsList.innerHTML = "";

  try {
    const res = await fetch("/api/getCompanies");
    if (!res.ok) throw new Error("Failed to fetch submissions");

    const data = await res.json();

    data.forEach((submit) => {
      // Card container
      const card = document.createElement("div");
      card.className =
        "border rounded-md shadow-sm p-4 bg-white flex flex-col mb-4";

      // Header: company name + toggle
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
      card.appendChild(header);

      // Details container (hidden by default)
      const details = document.createElement("div");
      details.className = "mt-2 hidden flex-col gap-2 text-gray-700";

      // Submitted date
      if (submit.createdAt) {
        const createdAt = new Date(submit.createdAt);
        const pDate = document.createElement("p");
        pDate.innerHTML = `<span class="font-semibold">Submitted:</span> ${createdAt.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}`;
        details.appendChild(pDate);
      }

      // Other fields
      for (const [key, value] of Object.entries(submit)) {
        if (key === "_id" || key === "createdAt") continue;

        if (key === "photos" && Array.isArray(value)) {
          // Photos container
          const photosDiv = document.createElement("div");
          photosDiv.className = "flex flex-wrap gap-2 mt-2";

          value.forEach((photo) => {
            const img = document.createElement("img");
            img.src = `/uploads/${photo.filename}`; // make sure server serves /uploads
            img.className = "w-24 h-24 object-cover border rounded";
            photosDiv.appendChild(img);
          });

          details.appendChild(photosDiv);
        } else if (Array.isArray(value)) {
          const p = document.createElement("p");
          p.innerHTML = `<span class="font-semibold">${key}:</span> ${value.join(", ")}`;
          details.appendChild(p);
        } else {
          const p = document.createElement("p");
          p.innerHTML = `<span class="font-semibold">${key}:</span> ${value}`;
          details.appendChild(p);
        }
      }

      // Toggle show/hide
      toggleBtn.addEventListener("click", () => {
        details.classList.toggle("hidden");
        toggleBtn.textContent = details.classList.contains("hidden")
          ? "Show More"
          : "Show Less";
      });

      card.appendChild(details);
      submissionsList.prepend(card);
    });
  } catch (err) {
    console.error(err);
    submissionsList.textContent = "Error loading submissions.";
  }
}

// Optional: call immediately if this script is included in admin page
document.addEventListener("DOMContentLoaded", loadSubmissions);
