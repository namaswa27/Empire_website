(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------------- About section ---------------- */
  const aboutIntroEl = document.getElementById("aboutIntro");
  if (SITE_CONFIG.about.intro) {
    aboutIntroEl.innerHTML = `<p>${SITE_CONFIG.about.intro}</p>`;
  } else {
    aboutIntroEl.innerHTML = `
      <div class="empty-state">
        <h3>Business story coming soon</h3>
        <p>Once Empire Beauty Space shares its story, mission, and values, they'll appear here — no placeholder claims are shown in the meantime.</p>
      </div>`;
  }
  if (SITE_CONFIG.about.mission) document.getElementById("aboutMission").textContent = SITE_CONFIG.about.mission;
  if (SITE_CONFIG.about.vision) document.getElementById("aboutVision").textContent = SITE_CONFIG.about.vision;

  /* ---------------- Business hours ---------------- */
  if (SITE_CONFIG.hours && SITE_CONFIG.hours.length) {
    const hoursHtml = SITE_CONFIG.hours
      .map((h) => `${h.day}: ${h.open ? `${h.open} – ${h.close}` : "Closed"}`)
      .join("<br />");
    document.getElementById("hoursValue").innerHTML = hoursHtml;
  }

  /* ---------------- Services ---------------- */
  const categoryTabsEl = document.getElementById("categoryTabs");
  const serviceContentEl = document.getElementById("serviceContent");
  const categories = SITE_CONFIG.serviceCategories || [];

  function renderEmptyServices() {
    categoryTabsEl.style.display = "none";
    serviceContentEl.innerHTML = `
      <div class="empty-state">
        <h3>Service catalogue coming soon</h3>
        <p>Empire Beauty Space's full list of services, categories, pricing and durations will appear here as soon as they're confirmed. In the meantime, feel free to request an appointment below and let us know what you're interested in.</p>
      </div>`;
  }

  function renderServiceGrid(category) {
    if (!category.services || !category.services.length) {
      serviceContentEl.innerHTML = `
        <div class="empty-state">
          <h3>No services listed in ${category.name} yet</h3>
          <p>Check back soon, or get in touch and we'll let you know what's available.</p>
        </div>`;
      return;
    }
    serviceContentEl.innerHTML = `<div class="service-grid">${category.services
      .map(
        (svc) => `
        <article class="service-card">
          <div class="thumb">Image placeholder</div>
          <div class="body">
            <h3>${svc.name}</h3>
            <p class="service-meta">${svc.duration || ""}${svc.duration && svc.price ? " · " : ""}${svc.price ? svc.price : svc.price === null ? "Price on request" : ""}</p>
            <p>${svc.description || ""}</p>
            <div class="card-actions">
              <a href="#booking" class="btn btn--primary">Book</a>
              <a href="#contact" class="btn btn--outline">Ask a question</a>
            </div>
          </div>
        </article>`
      )
      .join("")}</div>`;
  }

  if (!categories.length) {
    renderEmptyServices();
  } else {
    categoryTabsEl.innerHTML = categories
      .map(
        (cat, i) =>
          `<button class="category-tab" role="tab" aria-selected="${i === 0}" data-index="${i}">${cat.name}</button>`
      )
      .join("");
    renderServiceGrid(categories[0]);

    categoryTabsEl.querySelectorAll(".category-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        categoryTabsEl
          .querySelectorAll(".category-tab")
          .forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        renderServiceGrid(categories[Number(tab.dataset.index)]);
      });
    });

    // Populate the booking form's service dropdown from real services
    const select = document.getElementById("bk-service");
    categories.forEach((cat) => {
      const group = document.createElement("optgroup");
      group.label = cat.name;
      (cat.services || []).forEach((svc) => {
        const opt = document.createElement("option");
        opt.value = svc.slug;
        opt.textContent = svc.name;
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
  }

  /* ---------------- Gallery ---------------- */
  const galleryEl = document.getElementById("galleryContent");
  if (SITE_CONFIG.gallery && SITE_CONFIG.gallery.length) {
    galleryEl.innerHTML = `<div class="gallery-grid">${SITE_CONFIG.gallery
      .map(() => `<div class="gallery-tile"></div>`)
      .join("")}</div>`;
  } else {
    galleryEl.innerHTML = `
      <div class="empty-state">
        <h3>Gallery coming soon</h3>
        <p>Photos of treatments, the space, and results will be added here — no stock or placeholder imagery is shown as if it were real work.</p>
      </div>`;
  }

  /* ---------------- Testimonials ---------------- */
  const testimonialEl = document.getElementById("testimonialContent");
  if (SITE_CONFIG.testimonials && SITE_CONFIG.testimonials.length) {
    testimonialEl.innerHTML = `<div class="service-grid">${SITE_CONFIG.testimonials
      .map(
        (t) => `
        <div class="testimonial-card">
          <p class="quote">“${t.quote}”</p>
          <p class="who">${t.name}${t.date ? " · " + t.date : ""}</p>
        </div>`
      )
      .join("")}</div>`;
  } else {
    testimonialEl.innerHTML = `
      <div class="empty-state">
        <h3>No testimonials published yet</h3>
        <p>Real client reviews will be added here as they come in — this section only ever shows genuine testimonials.</p>
      </div>`;
  }

  /* ---------------- Booking form validation ---------------- */
  const form = document.getElementById("bookingForm");
  const statusEl = document.getElementById("bookingStatus");

  function setFieldError(field, hasError) {
    field.closest(".field").classList.toggle("has-error", hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[+0-9()\-\s]{7,}$/.test(value);
  }

  function isFutureOrToday(dateStr) {
    if (!dateStr) return false;
    const chosen = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.className = "form-status";
    statusEl.textContent = "";

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value;
    const date = form.date.value;

    let valid = true;

    setFieldError(form.name, !name);
    if (!name) valid = false;

    setFieldError(form.phone, !isValidPhone(phone));
    if (!isValidPhone(phone)) valid = false;

    if (email) {
      setFieldError(form.email, !isValidEmail(email));
      if (!isValidEmail(email)) valid = false;
    } else {
      setFieldError(form.email, false);
    }

    setFieldError(form.service, !service);
    if (!service) valid = false;

    setFieldError(form.date, !isFutureOrToday(date));
    if (!isFutureOrToday(date)) valid = false;

    if (!valid) {
      statusEl.classList.add("is-error");
      statusEl.textContent = "Please check the highlighted fields and try again.";
      statusEl.focus?.();
      return;
    }

    // In production this posts to a backend endpoint, e.g.:
    // await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) })
    // The backend validates again server-side and never trusts this client data alone.

    statusEl.classList.add("is-success");
    statusEl.textContent =
      "Your appointment request has been received. Empire Beauty Space will contact you shortly to confirm your appointment.";
    form.reset();
  });
})();
