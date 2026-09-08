/* Kuya's Barber Shop - Booking System */

(function () {
  "use strict";

  const STORAGE_KEY = "kuyaBarberAppointments";

  const form = document.getElementById("bookingForm");
  const success = document.getElementById("bookingSuccess");

  if (!form) {
    console.error("Kuya's Barber Shop: bookingForm was not found.");
    return;
  }

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const branchInput = document.getElementById("branch");
  const serviceInput = document.getElementById("service");
  const dateInput = document.getElementById("bookingDate");
  const timeInput = document.getElementById("bookingTime");
  const barberInput = document.getElementById("barber");

  /*
   * Prevent customers from selecting a past date.
   */
  if (dateInput) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
  }

  /*
   * Get saved appointments.
   */
  function getAppointments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      console.error("Unable to read appointments:", error);
      return [];
    }
  }

  /*
   * Save appointments.
   */
  function saveAppointments(appointments) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(appointments)
    );
  }

  /*
   * Create a simple booking reference number.
   */
  function createBookingReference() {
    const now = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `KBS-${now.toString().slice(-6)}-${random}`;
  }

  /*
   * Format date for the confirmation message.
   */
  function formatDate(dateValue) {
    const date = new Date(dateValue + "T00:00:00");

    return date.toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /*
   * Format time.
   */
  function formatTime(timeValue) {
    if (!timeValue) return "";

    const parts = timeValue.split(":");

    let hour = parseInt(parts[0], 10);
    const minute = parts[1] || "00";

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  }

  /*
   * Check whether the selected time is already booked.
   *
   * Same branch + same date + same time + same barber
   * will be treated as unavailable.
   */
  function isAlreadyBooked(branch, date, time, barber) {
    const appointments = getAppointments();

    return appointments.some(function (appointment) {
      return (
        appointment.branch === branch &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.barber === barber
      );
    });
  }

  /*
   * Submit booking.
   */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const branch = branchInput ? branchInput.value : "";
    const service = serviceInput ? serviceInput.value : "";
    const date = dateInput ? dateInput.value : "";
    const time = timeInput ? timeInput.value : "";
    const barber = barberInput ? barberInput.value : "";

    /*
     * Basic validation.
     */
    if (
      !name ||
      !phone ||
      !branch ||
      !service ||
      !date ||
      !time ||
      !barber
    ) {
      alert("Please complete all booking details.");
      return;
    }

    /*
     * Prevent past dates.
     */
    const selectedDate = new Date(date + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Please select today or a future date.");
      return;
    }

    /*
     * Check duplicate booking.
     */
    if (isAlreadyBooked(branch, date, time, barber)) {
      alert(
        "Sorry, this time slot is already booked for the selected barber. Please choose another time."
      );
      return;
    }

    /*
     * Create appointment.
     */
    const appointment = {
      id: Date.now(),
      reference: createBookingReference(),

      name: name,
      phone: phone,

      branch: branch,
      service: service,

      date: date,
      time: time,

      barber: barber,

      createdAt: new Date().toISOString()
    };

    /*
     * Save appointment.
     */
    const appointments = getAppointments();

    appointments.push(appointment);

    saveAppointments(appointments);

    /*
     * Show confirmation.
     */
    if (success) {
      success.innerHTML = `
        <div class="booking-success-message">
          <div class="success-icon">✓</div>

          <div>
            <strong>Thank you, ${escapeHtml(name)}!</strong>

            <p>
              Your appointment at
              <strong>${escapeHtml(branch)}</strong>
              on
              <strong>${formatDate(date)}</strong>
              at
              <strong>${formatTime(time)}</strong>
              has been received.
            </p>

            <p>
              <strong>Service:</strong>
              ${escapeHtml(service)}
            </p>

            <p>
              <strong>Barber:</strong>
              ${escapeHtml(barber)}
            </p>

            <p>
              <strong>Booking Reference:</strong>
              ${escapeHtml(appointment.reference)}
            </p>

            <small>
              Please keep your booking reference for your records.
            </small>
          </div>
        </div>
      `;

      success.style.display = "block";

      success.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    /*
     * Reset the form after successful booking.
     */
    form.reset();

    /*
     * Restore today's minimum date after reset.
     */
    if (dateInput) {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = String(
        currentDate.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        currentDate.getDate()
      ).padStart(2, "0");

      dateInput.min = `${year}-${month}-${day}`;
    }
  });

  /*
   * Prevent HTML injection in customer-provided information.
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

})();
