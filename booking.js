/* Kuya's Barber Shop - Booking System */

(function () {
  const STORAGE_KEY = "kuyaBarberAppointments";

  const formArea = document.getElementById("formArea");
  const success = document.getElementById("success");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const branchInput = document.getElementById("branch");
  const serviceInput = document.getElementById("service");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const barberInput = document.getElementById("barber");

  if (!formArea || !success) return;

  /* Prevent customers from selecting a past date */
  if (dateInput) {
    const today = new Date();

    const localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    dateInput.min = localToday;
  }

  function getBookings() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  function saveBooking(booking) {
    const bookings = getBookings();

    bookings.push(booking);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bookings)
    );
  }

  function formatDate(value) {
    const date = new Date(value + "T00:00:00");

    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function showMessage(message, isError) {
    success.innerHTML = message;

    success.style.display = "block";

    if (isError) {
      success.style.background = "#ffe8e8";
      success.style.color = "#8b1e1e";
    } else {
      success.style.background = "#e8f7e8";
      success.style.color = "#145c20";
    }
  }

  window.submitBook = function () {

    const name = nameInput
      ? nameInput.value.trim()
      : "";

    const phone = phoneInput
      ? phoneInput.value.trim()
      : "";

    const branch = branchInput
      ? branchInput.value
      : "";

    const service = serviceInput
      ? serviceInput.value
      : "";

    const date = dateInput
      ? dateInput.value
      : "";

    const time = timeInput
      ? timeInput.value
      : "";

    const barber = barberInput
      ? barberInput.value || "Any Available Barber"
      : "Any Available Barber";

    /* Required fields */
    if (!name || !phone || !date || !time) {
      showMessage(
        "⚠️ Please complete your name, mobile number, date and time.",
        true
      );
      return;
    }

    /* Philippine mobile number validation */
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (!/^09\d{9}$/.test(cleanPhone)) {
      showMessage(
        "⚠️ Please enter a valid Philippine mobile number (09XXXXXXXXX).",
        true
      );
      return;
    }

    /* Create booking reference */
    const booking = {
      id:
        "KBS-" +
        Date.now()
          .toString(36)
          .toUpperCase(),

      name: name,
      phone: cleanPhone,
      branch: branch,
      service: service,
      date: date,
      time: time,
      barber: barber,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    /* Prevent duplicate booking */
    const duplicate = getBookings().some(function (item) {
      return (
        item.branch === booking.branch &&
        item.date === booking.date &&
        item.time === booking.time &&
        item.barber === booking.barber
      );
    });

    if (duplicate) {
      showMessage(
        "⚠️ This time slot is already booked on this device. Please choose another time.",
        true
      );
      return;
    }

    /* Save appointment */
    saveBooking(booking);

    /* Hide form */
    formArea.style.display = "none";

    /* Show confirmation */
    showMessage(
      "✅ <strong>Booking Received!</strong><br><br>" +
      "Reference: <strong>" + booking.id + "</strong><br><br>" +
      "Thank you, " + booking.name + "!<br>" +
      "Your <strong>" + booking.service + "</strong> appointment at " +
      "<strong>" + booking.branch + "</strong><br>" +
      "is requested for <strong>" +
      formatDate(booking.date) +
      "</strong> at <strong>" +
      booking.time +
      "</strong>.<br><br>" +
      "Preferred Barber: <strong>" +
      booking.barber +
      "</strong><br><br>" +
      "<small>Your booking has been saved successfully.</small>",
      false
    );

    success.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };

})();
