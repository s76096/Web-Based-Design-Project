document.addEventListener("DOMContentLoaded", () => {

const form = document.querySelector(".booking-form");
const manageBtn = document.querySelector(".manage-btn");
const details = document.getElementById("bookingDetails");
const message = document.getElementById("bookingMessage");

const pickupLocation = document.getElementById("pickupLocation");
const dropLocation = document.getElementById("dropLocation");
const pickupDate = document.getElementById("pickupDate");
const dropDate = document.getElementById("dropDate");
const pickupTime = document.getElementById("pickupTime");
const dropTime = document.getElementById("dropTime");
const age = document.getElementById("age");
const phone = document.getElementById("phone");
const carType = document.getElementById("carType");
const carModel = document.getElementById("carModel");
const promo = document.getElementById("promo");

/* ================= TIME GENERATOR ================= */
function generateTimes(select) {
  select.innerHTML = `<option value="">Select time</option>`;
  for (let h = 10; h <= 21; h++) {
    for (let m of [0, 30]) {
      if (h === 21 && m === 30) continue;
      select.innerHTML += `<option>${String(h).padStart(2,'0')}:${m === 0 ? '00' : '30'}</option>`;
    }
  }
}
generateTimes(pickupTime);
generateTimes(dropTime);

/* ================= GPS DATA ================= */
const locationCoords = {
  "Kuala Terengganu": "Kuala Terengganu",
  "Marang": "Marang",
  "Besut": "Besut",
  "Setiu": "Setiu",
  "Kemaman": "Kemaman",
  "Dungun": "Dungun"
};

/* expose globally for onclick */
window.openGPS = function(locationName) {
  const coords = locationCoords[locationName];
  if (!coords) {
    alert("Location not found.");
    return;
  }
  window.open(`https://www.google.com/maps?q=${coords}`, "_blank");
};

/* ================= STORAGE ================= */
const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];
const saveBookings = b => localStorage.setItem("bookings", JSON.stringify(b));

const toMinutes = t => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/* ================= CAR MODELS ================= */
const carModels = {
  Economy: [
    { name: "Perodua Axia", rate: 12 },
    { name: "Perodua Myvi", rate: 14 }
  ],
  Sedan: [
    { name: "Proton Saga", rate: 15 },
    { name: "Toyota Vios", rate: 20 }
  ],
  SUV: [
    { name: "Perodua Ativa", rate: 25 },
    { name: "Toyota Fortuner", rate: 35 }
  ]
};

carType.addEventListener("change", () => {
  carModel.innerHTML = `<option value="">Select car model</option>`;
  if (!carType.value) return;

  carModels[carType.value].forEach(car => {
    const opt = document.createElement("option");
    opt.value = car.name;
    opt.dataset.rate = car.rate;
    opt.textContent = `${car.name} (RM ${car.rate}/hour)`;
    carModel.appendChild(opt);
  });
});

/* ================= CALCULATIONS ================= */
function calculateHours(pDate, pTime, dDate, dTime) {
  const start = new Date(`${pDate}T${pTime}`);
  const end = new Date(`${dDate}T${dTime}`);
  return Math.ceil((end - start) / (1000 * 60 * 60));
}

const INSURANCE_FEE = 20;

/* ================= SUBMIT ================= */
form.addEventListener("submit", e => {
  e.preventDefault();

  const selectedModel = carModel.options[carModel.selectedIndex];

  const booking = {
    pickupLocation: pickupLocation.value,
    dropLocation: dropLocation.value,
    pickupDate: pickupDate.value,
    pickupTime: pickupTime.value,
    dropDate: dropDate.value,
    dropTime: dropTime.value,
    age: age.value,
    phone: phone.value,
    carType: carType.value,
    carModel: selectedModel.value,
    rate: Number(selectedModel.dataset.rate),
    promo: promo.value
  };

  if (Object.values(booking).slice(0, 10).some(v => !v)) {
    message.textContent = "⚠️ Please fill in all required fields.";
    message.style.color = "red";
    return;
  }

  if (booking.age < 21) {
    message.textContent = "❌ Driver must be at least 21.";
    return;
  }

  if (booking.pickupDate === booking.dropDate) {
    if (toMinutes(booking.dropTime) - toMinutes(booking.pickupTime) < 120) {
      message.textContent = "❌ Minimum rental is 2 hours.";
      return;
    }
  }

  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);

  message.textContent = "✅ Booking successful!";
  message.style.color = "green";

  const hours = calculateHours(
    booking.pickupDate,
    booking.pickupTime,
    booking.dropDate,
    booking.dropTime
  );

  const subtotal = hours * booking.rate;
  const total = subtotal + INSURANCE_FEE;

  /* ===== CHECKOUT SUMMARY (CLICKABLE LOCATIONS) ===== */
  details.innerHTML = `
    <h3>Checkout Summary</h3>

    <p>
      <strong>Pick-up:</strong>
      <span class="location-link" onclick="openGPS('${booking.pickupLocation}')">
        📍 ${booking.pickupLocation}
      </span>
    </p>

    <p>
      <strong>Drop-off:</strong>
      <span class="location-link" onclick="openGPS('${booking.dropLocation}')">
        📍 ${booking.dropLocation}
      </span>
    </p>

    <p><strong>Pick-up:</strong> ${booking.pickupDate} ${booking.pickupTime}</p>
    <p><strong>Drop-off:</strong> ${booking.dropDate} ${booking.dropTime}</p>

    <p><strong>Car:</strong> ${booking.carModel}</p>
    <p><strong>Rate:</strong> RM ${booking.rate} / hour</p>

    <p><strong>Duration:</strong> ${hours} hours</p>

    <hr>

    <p><strong>Travel Insurance:</strong> RM ${INSURANCE_FEE}</p>
    <p><strong>Subtotal:</strong> RM ${subtotal}</p>

    <h2>Total: RM ${total}</h2>

    <button class="search-btn">CONFIRM BOOKING</button>
  `;

  details.style.display = "block";
  form.reset();
});

/* ================= MANAGE ================= */
manageBtn.addEventListener("click", () => {
  const bookings = getBookings();
  if (!bookings.length) return alert("No bookings found.");

  const b = bookings[bookings.length - 1];
  details.innerHTML = `
    <h3>Your Booking Details</h3>
    <p><strong>Pick-up:</strong> ${b.pickupLocation}</p>
    <p><strong>Drop-off:</strong> ${b.dropLocation}</p>
    <p><strong>Phone:</strong> ${b.phone}</p>
    <p><strong>Car:</strong> ${b.carType}</p>
  `;
  details.style.display = "block";
});

});