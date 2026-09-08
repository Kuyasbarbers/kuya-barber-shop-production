/* Kuya's Barber Shop - Booking System */

(function () {
  const STORAGE_KEY = "kuyaBarberAppointments";

  const form = document.getElementById("bookingForm");
  const success = document.getElementById("bookingSuccess");

  if (!form) return;

  const dateInput = document.getElementById("bookingDate");

  // Prevent customers from selecting a past date
  if (dateInput) {
    const today = new Date();

    const localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    dateInput.min = localToday;
  }

  // Get saved appointments
  function getBookings() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  // Save appointment
  function saveBooking(booking) {
    const bookings = getBookings();

    bookings.push(booking);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bookings)
    );
  }

  // Format date
  function formatDate(value) {
    const date = new Date(value + "T00:00:00");

    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const booking = {
        id:
          "KBS-" +
          Date.now()
            .toString(36)
            .toUpperCase(),

        name:
          document
            .getElementById("customerName")
            .value
            .trim(),

        phone:
          document
            .getElementById("customerPhone")
            .value
            .trim(),

        branch:
          document.getElementById("branch").value,

        service:
          document.getElementById("service").value,

        date:
          document
            .getElementById("bookingDate")
            .value,

        time:
          document
            .getElementById("bookingTime")
            .value,

        barber:
          document.getElementById("barber").value ||
          "Any Available Barber",

        status: "Pending",

        createdAt:
          new Date().toISOString()
      };

      // Validate Philippine mobile number
      const phone = booking.phone.replace(
        /[\s-]/g,
        ""
      );

      if (!/^09\d{9}$/.test(phone)) {
        success.innerHTML =
          "⚠️ Please enter a valid Philippine mobile number (09XXXXXXXXX).";

        success.className =
          "booking-success booking-error";

        success.style.display = "block";

        return;
      }

      // Prevent duplicate booking on this device
      const duplicate = getBookings().some(
        function (item) {
          return (
            item.branch === booking.branch &&
            item.date === booking.date &&
            item.time === booking.time &&
            item.barber === booking.barber
          );
        }
      );

      if (duplicate) {
        success.innerHTML =
          "⚠️ You already have a booking for this branch, date, time and barber on this device. Please choose another slot.";

        success.className =
          "booking-success booking-error";

        success.style.display = "block";

        return;
      }

      // Save booking
      saveBooking(booking);

      // Show confirmation
      success.className = "booking-success";

      success.innerHTML =
        "✅ <strong>Booking received!</strong><br><br>" +

        "Booking Reference: " +
        "<strong>" +
        booking.id +
        "</strong><br><br>" +

        "Thank you, " +
        booking.name +
        "!<br>" +

        "Your <strong>" +
        booking.service +
        "</strong> appointment at " +

        "<strong>" +
        booking.branch +
        "</strong> is requested for " +

        "<strong>" +
        formatDate(booking.date) +
        "</strong> at " +

        "<strong>" +
        booking.time +
        "</strong>.<br><br>" +

        "<small>Your booking has been saved successfully.</small>";

      success.style.display = "block";

      form.reset();

      success.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    },
    true
  );
})();
