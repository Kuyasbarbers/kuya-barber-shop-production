/* =========================================================
   KUYA'S BARBER SHOP
   BOOKING SYSTEM
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     SETTINGS
     ========================================================= */

  const STORAGE_KEY = "kuyaBarberAppointments";


  /* =========================================================
     START SYSTEM
     ========================================================= */

  function initializeBookingSystem() {

    const form = document.getElementById("bookingForm");

    const success = document.getElementById("bookingSuccess");

    const nameInput = document.getElementById("customerName");

    const phoneInput = document.getElementById("customerPhone");

    const branchInput = document.getElementById("branch");

    const serviceInput = document.getElementById("service");

    const dateInput = document.getElementById("bookingDate");

    const timeInput = document.getElementById("bookingTime");

    const barberInput = document.getElementById("barber");


    /* =======================================================
       CHECK BOOKING FORM
       ======================================================= */

    if (!form) {

      console.error(
        "Kuya's Barber Shop: bookingForm was not found."
      );

      return;
    }


    /* =======================================================
       SET MINIMUM DATE
       Prevent customers from selecting a past date
       ======================================================= */

    function setMinimumDate() {

      if (!dateInput) {
        return;
      }

      const today = new Date();

      const year = today.getFullYear();

      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        today.getDate()
      ).padStart(2, "0");

      dateInput.min =
        `${year}-${month}-${day}`;
    }


    setMinimumDate();


    /* =======================================================
       BRANCH SELECTION
       Used by:

       onclick="chooseBranch('Goa Branch')"

       onclick="chooseBranch('Tigaon Branch')"
       ======================================================= */

    window.chooseBranch = function (branchName) {

      if (!branchInput) {
        console.error(
          "Kuya's Barber Shop: branch input was not found."
        );

        return;
      }

      branchInput.value = branchName;


      /* Scroll to booking form */

      const bookingSection =
        document.getElementById("booking");

      if (bookingSection) {

        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }


      /* Optional visual focus */

      branchInput.focus();
    };


    /* =======================================================
       GET SAVED APPOINTMENTS
       ======================================================= */

    function getAppointments() {

      try {

        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          return [];
        }

        const appointments =
          JSON.parse(saved);

        if (!Array.isArray(appointments)) {
          return [];
        }

        return appointments;

      } catch (error) {

        console.error(
          "Unable to read appointments:",
          error
        );

        return [];
      }
    }


    /* =======================================================
       SAVE APPOINTMENTS
       ======================================================= */

    function saveAppointments(appointments) {

      try {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(appointments)
        );

        return true;

      } catch (error) {

        console.error(
          "Unable to save appointment:",
          error
        );

        alert(
          "Unable to save your appointment. Please try again."
        );

        return false;
      }
    }


    /* =======================================================
       CREATE BOOKING REFERENCE
       Example:

       KBS-123456-5821
       ======================================================= */

    function createBookingReference() {

      const now = Date.now();

      const random =
        Math.floor(
          1000 + Math.random() * 9000
        );

      return (
        "KBS-" +
        now.toString().slice(-6) +
        "-" +
        random
      );
    }


    /* =======================================================
       FORMAT DATE
       ======================================================= */

    function formatDate(dateValue) {

      if (!dateValue) {
        return "";
      }

      const date =
        new Date(
          dateValue + "T00:00:00"
        );

      if (Number.isNaN(date.getTime())) {
        return dateValue;
      }

      return date.toLocaleDateString(
        "en-PH",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );
    }


    /* =======================================================
       FORMAT TIME
       ======================================================= */

    function formatTime(timeValue) {

      if (!timeValue) {
        return "";
      }

      const parts =
        timeValue.split(":");

      let hour =
        parseInt(parts[0], 10);

      const minute =
        parts[1] || "00";

      if (Number.isNaN(hour)) {
        return timeValue;
      }

      const period =
        hour >= 12 ? "PM" : "AM";

      hour =
        hour % 12 || 12;

      return (
        `${hour}:${minute} ${period}`
      );
    }


    /* =======================================================
       ESCAPE HTML
       Protect customer-entered information
       ======================================================= */

    function escapeHtml(value) {

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }


    /* =======================================================
       CHECK DUPLICATE BOOKING

       Same:
       Branch
       +
       Date
       +
       Time
       +
       Barber

       = Already booked
       ======================================================= */

    function isAlreadyBooked(
      branch,
      date,
      time,
      barber
    ) {

      const appointments =
        getAppointments();

      return appointments.some(
        function (appointment) {

          return (
            appointment.branch === branch &&
            appointment.date === date &&
            appointment.time === time &&
            appointment.barber === barber
          );

        }
      );
    }


    /* =======================================================
       FORM SUBMISSION
       ======================================================= */

    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        /* ---------------------------------------------------
           GET FORM VALUES
           --------------------------------------------------- */

        const name =
          nameInput
            ? nameInput.value.trim()
            : "";

        const phone =
          phoneInput
            ? phoneInput.value.trim()
            : "";

        const branch =
          branchInput
            ? branchInput.value.trim()
            : "";

        const service =
          serviceInput
            ? serviceInput.value.trim()
            : "";

        const date =
          dateInput
            ? dateInput.value
            : "";

        const time =
          timeInput
            ? timeInput.value
            : "";

        const barber =
          barberInput
            ? barberInput.value.trim()
            : "";


        /* ---------------------------------------------------
           VALIDATION
           --------------------------------------------------- */

        if (
          !name ||
          !phone ||
          !branch ||
          !service ||
          !date ||
          !time ||
          !barber
        ) {

          alert(
            "Please complete all booking details before confirming your appointment."
          );

          return;
        }


        /* ---------------------------------------------------
           PREVENT PAST DATE
           --------------------------------------------------- */

        const selectedDate =
          new Date(
            date + "T00:00:00"
          );

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );


        if (
          Number.isNaN(
            selectedDate.getTime()
          )
        ) {

          alert(
            "Please select a valid appointment date."
          );

          return;
        }


        if (selectedDate < today) {

          alert(
            "Please select today or a future date."
          );

          return;
        }


        /* ---------------------------------------------------
           DUPLICATE BOOKING CHECK
           --------------------------------------------------- */

        if (
          isAlreadyBooked(
            branch,
            date,
            time,
            barber
          )
        ) {

          alert(
            "Sorry, this time slot is already booked for the selected barber. Please choose another time."
          );

          return;
        }


        /* ---------------------------------------------------
           CREATE APPOINTMENT
           --------------------------------------------------- */

        const appointment = {

          id: Date.now(),

          reference:
            createBookingReference(),

          name: name,

          phone: phone,

          branch: branch,

          service: service,

          date: date,

          time: time,

          barber: barber,

          createdAt:
            new Date().toISOString()
        };


        /* ---------------------------------------------------
           GET EXISTING APPOINTMENTS
           --------------------------------------------------- */

        const appointments =
          getAppointments();


        /* ---------------------------------------------------
           ADD NEW APPOINTMENT
           --------------------------------------------------- */

        appointments.push(
          appointment
        );


        /* ---------------------------------------------------
           SAVE
           --------------------------------------------------- */

        const saved =
          saveAppointments(
            appointments
          );


        if (!saved) {
          return;
        }


        /* ---------------------------------------------------
           SHOW SUCCESS MESSAGE
           --------------------------------------------------- */

        if (success) {

          success.innerHTML = `

            <div class="booking-success-message">

              <div class="success-icon">
                ✓
              </div>

              <div>

                <strong>
                  Thank you, ${escapeHtml(name)}!
                </strong>

                <p>

                  Your appointment at
                  <strong>
                    ${escapeHtml(branch)}
                  </strong>

                  on

                  <strong>
                    ${escapeHtml(formatDate(date))}
                  </strong>

                  at

                  <strong>
                    ${escapeHtml(formatTime(time))}
                  </strong>

                  has been received.

                </p>

                <p>

                  <strong>
                    Service:
                  </strong>

                  ${escapeHtml(service)}

                </p>

                <p>

                  <strong>
                    Barber:
                  </strong>

                  ${escapeHtml(barber)}

                </p>

                <p>

                  <strong>
                    Phone:
                  </strong>

                  ${escapeHtml(phone)}

                </p>

                <p>

                  <strong>
                    Booking Reference:
                  </strong>

                  ${escapeHtml(
                    appointment.reference
                  )}

                </p>

                <small>

                  Please keep your booking reference
                  for your records.

                </small>

              </div>

            </div>

          `;


          success.style.display =
            "block";


          /* Scroll to confirmation */

          success.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }


        /* ---------------------------------------------------
           RESET FORM
           --------------------------------------------------- */

        form.reset();


        /* ---------------------------------------------------
           RESTORE MINIMUM DATE
           --------------------------------------------------- */

        setMinimumDate();

      }
    );


    /* =======================================================
       SYSTEM READY
       ======================================================= */

    console.log(
      "Kuya's Barber Shop booking system is ready."
    );

  }


  /* =========================================================
     START AFTER HTML HAS LOADED
     ========================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeBookingSystem
    );

  } else {

    initializeBookingSystem();

  }

})();
