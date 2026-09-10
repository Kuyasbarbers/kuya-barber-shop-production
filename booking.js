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

       updateServicesByBranch();


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
       BRANCH-SPECIFIC SERVICES
       Goa = Hair + Nail Services
       Tigaon = Hair + Nail + Massage & Wellness
       ======================================================= */

    const hairServices = [
      "Haircut — Men & Women",
      "Hair Color",
      "Hair Treatment",
      "Hair Rebonding",
      "Hair Perming",
      "Hair Protein Straight",
      "Scalp Treatment"
    ];

    const nailServices = [
      "Manicure & Pedicure",
      "Gel Polish",
      "Nail Extensions",
      "Footspa"
    ];

    const massageServices = [
      "Swedish Massage",
      "Thai Massage",
      "Shiatsu Massage",
      "Combination Massage",
      "Hot Stone Massage",
      "Ventosa",
      "Ear Candling",
      "Premium Footspa"
    ];

    function updateServicesByBranch() {

      if (!serviceInput || !branchInput) {
        return;
      }

      let availableServices = [
        ...hairServices,
        ...nailServices
      ];

      if (branchInput.value === "Tigaon Branch") {
        availableServices = [
          ...availableServices,
          ...massageServices
        ];
      }

      serviceInput.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select Service";
      serviceInput.appendChild(defaultOption);

      availableServices.forEach(function (service) {

        const option = document.createElement("option");

        option.value = service;
        option.textContent = service;

        serviceInput.appendChild(option);

      });
    }

    branchInput.addEventListener(
      "change",
      updateServicesByBranch
    );
         /* =======================================================
       BRANCH + SERVICE STAFF FILTER
       ======================================================= */

    const goaHairStaff = [
      "KUYA JERIC",
      "KUYA CRIX",
      "KUYA GIO",
      "ATE MARJ"
    ];

    const goaNailStaff = [
      "ATE DONA",
      "ATE SHIE"
    ];

    const tigaonHairStaff = [
      "KUYA HANZ"
    ];

    const tigaonNailStaff = [
      "ATE LYKA"
    ];

    const tigaonMassageStaff = [
      "ATE LYKA",
      "ATE RESH"
    ];
     /* =======================================================
   STAFF WORK SCHEDULE
   ======================================================= */

const staffSchedules = {

  "KUYA JERIC": {
    days: [2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "20:00"
  },

  "KUYA CRIX": {
    days: [1, 2, 3, 5, 6, 0],
    start: "08:00",
    end: "20:00"
  },

  "KUYA GIO": {
    days: [1, 2, 4, 5, 6, 0],
    start: "08:00",
    end: "20:00"
  },

  "ATE MARJ": {
    days: [1, 2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "18:00"
  },

  "ATE DONA": {
    days: [1, 2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "18:00"
  },

  "ATE SHIE": {
    days: [2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "18:00"
  },

  "KUYA HANZ": {
    days: [1, 2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "20:00"
  },

  "ATE LYKA": {
    days: [2, 3, 4, 5, 6, 0],
    start: "08:00",
    end: "20:00"
  },

  "ATE RESH": {
    days: [1, 2, 4, 5, 6, 0],
    start: "11:00",
    end: "23:00"
  }

};
/* =======================================================
   CHECK STAFF AVAILABILITY
   ======================================================= */

function isStaffAvailable(staff, date, time) {

  if (
    !staff ||
    staff === "Any Available Staff"
  ) {
    return true;
  }

  const schedule =
    staffSchedules[staff];

  if (!schedule || !date || !time) {
    return false;
  }

  const selectedDate =
    new Date(date + "T00:00:00");

  if (
    Number.isNaN(
      selectedDate.getTime()
    )
  ) {
    return false;
  }

  const day =
    selectedDate.getDay();

  if (!schedule.days.includes(day)) {
    return false;
  }

  const selectedMinutes =
  Number(time.split(":")[0]) * 60 +
  Number(time.split(":")[1]);

const startMinutes =
  Number(schedule.start.split(":")[0]) * 60 +
  Number(schedule.start.split(":")[1]);

const endMinutes =
  Number(schedule.end.split(":")[0]) * 60 +
  Number(schedule.end.split(":")[1]);

return (
  selectedMinutes >= startMinutes &&
  selectedMinutes <= endMinutes
);
}
    function updateStaffBySelection() {

      if (!barberInput || !branchInput || !serviceInput) {
        return;
      }

      const branch = branchInput.value;
      const service = serviceInput.value;

      let availableStaff = [];

      /* GOA BRANCH */

      if (branch === "Goa Branch") {

        if (
          hairServices.includes(service)
        ) {
          availableStaff = goaHairStaff;
        }

        else if (
          nailServices.includes(service)
        ) {
          availableStaff = goaNailStaff;
        }

      }

      /* TIGAON BRANCH */

      else if (branch === "Tigaon Branch") {

        if (
          hairServices.includes(service)
        ) {
          availableStaff = tigaonHairStaff;
        }

        else if (
          nailServices.includes(service)
        ) {
          availableStaff = tigaonNailStaff;
        }

        else if (
          massageServices.includes(service)
        ) {
          availableStaff = tigaonMassageStaff;
        }

      }
           /* Filter staff based on selected date and time */

    if (
      dateInput &&
      timeInput &&
      dateInput.value &&
      timeInput.value
    ) {

      availableStaff =
        availableStaff.filter(function (staff) {

          return isStaffAvailable(
            staff,
            dateInput.value,
            timeInput.value
          );

        });

    }

      barberInput.innerHTML = "";

      const defaultOption =
        document.createElement("option");

      defaultOption.value = "";
      defaultOption.textContent = "Select Staff";

      barberInput.appendChild(defaultOption);

      if (availableStaff.length > 0) {

        const anyOption =
          document.createElement("option");

        anyOption.value = "Any Available Staff";
        anyOption.textContent =
          "Any Available Staff";

        barberInput.appendChild(anyOption);

      }

      availableStaff.forEach(function (staff) {

        const option =
          document.createElement("option");

        option.value = staff;
        option.textContent = staff;

        barberInput.appendChild(option);

      });

    }


    /* Update staff when branch changes */

    branchInput.addEventListener(
      "change",
      updateStaffBySelection
    );


    /* Update staff when service changes */

  serviceInput.addEventListener(
  "change",
  updateStaffBySelection
);


/* Update staff when date changes */

dateInput.addEventListener(
  "change",
  updateStaffBySelection
);

/* Update staff when time changes */

timeInput.addEventListener(
  "change",
  updateStaffBySelection
);

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

  const appointments = getAppointments();

  let highestNumber = 0;

  appointments.forEach(function (appointment) {

    if (!appointment.reference) {
      return;
    }

    const match =
      appointment.reference.match(/^KBS-(\d+)$/);

    if (match) {

      const number =
        parseInt(match[1], 10);

      if (number > highestNumber) {
        highestNumber = number;
      }
    }

  });

  const nextNumber =
    highestNumber + 1;

  return (
    "KBS-" +
    String(nextNumber).padStart(3, "0")
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
