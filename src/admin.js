export async function loadSubmissions() {
  submissionsList.innerHTML = "";

  try {
    const res = await fetch("/api/getCompanies");
    if (!res.ok) throw new Error("Failed to fetch submissions");
    const data = await res.json();

    data.forEach((submit) => {
      const card = document.createElement("div");
      card.className = "border rounded-md shadow-sm p-4 bg-white flex flex-col";

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

      const details = document.createElement("div");
      details.className = "mt-2 hidden flex-col gap-1 text-gray-700";

      // Dates
      if (submit.createdAt) {
        const createdAt = new Date(submit.createdAt);
        const pDate = document.createElement("p");
        pDate.innerHTML = `<span class="font-semibold">Submitted:</span> ${createdAt.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}`;
        details.appendChild(pDate);
      }

      for (const [key, value] of Object.entries(submit)) {
        if (key === "_id" || key === "createdAt") continue;

        if (key === "photos" && Array.isArray(value)) {
          const photosDiv = document.createElement("div");
          photosDiv.className = "flex flex-wrap gap-2 mt-2";

          value.forEach((photo) => {
            const img = document.createElement("img");
            img.src = `/uploads/${photo.filename}`; // asigură-te că serverul servește folderul uploads
            img.className = "w-24 h-24 object-cover border rounded";
            photosDiv.appendChild(img);
          });

          details.appendChild(photosDiv);
        } else {
          const p = document.createElement("p");
          p.innerHTML = `<span class="font-semibold">${key}:</span> ${value}`;
          details.appendChild(p);
        }
      }

      toggleBtn.addEventListener("click", () => {
        details.classList.toggle("hidden");
        toggleBtn.textContent = details.classList.contains("hidden")
          ? "Show More"
          : "Show Less";
      });

      card.appendChild(header);
      card.appendChild(details);
      submissionsList.prepend(card);
    });
  } catch (err) {
    console.error(err);
    submissionsList.textContent = "Error loading submissions.";
  }
}
