document.addEventListener("DOMContentLoaded", () => {
  const studentSelect = document.getElementById("studentSelect");
  const attendanceTable = document
    .getElementById("attendanceTable")
    .querySelector("tbody");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const printBtn = document.getElementById("printBtn");
  const caption = document.querySelector("#attendanceTable caption");
  let studentCount = 0;

  // Define month names in Uzbek Cyrillic
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  // Fetch the student data from the external JSON file
  fetch("students.json")
    .then((response) => response.json())
    .then((data) => {
      const students = data.students;

      // Populate the dropdown with student names
      students.forEach((student, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = student.fullName;
        studentSelect.appendChild(option);
      });

      // Add selected student to the table
      addStudentBtn.addEventListener("click", () => {
        const selectedOptions = Array.from(studentSelect.selectedOptions);
        selectedOptions.forEach((option) => {
          const student = students[option.value];
          const row = attendanceTable.insertRow();
          studentCount++;

          row.insertCell(0).textContent = studentCount; // №
          row.insertCell(1).textContent = student.fullName; // Student Name
          row.insertCell(2).textContent = student.mfy; // MFY
          row.insertCell(3).textContent = student.street; // Street
          row.insertCell(4).textContent = student.house; // House
          row.insertCell(5).textContent = student.parentName; // Parents Name (for future use)
          row.insertCell(6).textContent = student.parentNumber; // Number (for future use)
        });
      });
    })
    .catch((error) => console.error("Error fetching the student data:", error));

  // Set the table caption dynamically
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const monthIndex = today.getMonth(); // Month index (0-11)
  const monthName = monthNames[monthIndex]; // Get the month name from the array

  caption.textContent = `Бешарик тумани 2-умумтаълим мактаби бўйича ${year} йил ${day} ${monthName} куни дарсга келмаган ўқувчилар тўғрисидаги Маълумот`;

  // Download PDF
  printBtn.addEventListener("click", () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "."); // Format: dd.mm.yyyy
    const pdfFileName = `${formattedDate}-davomat.pdf`;

    // Update caption with the current date for the PDF
    caption.textContent = `Бешарик тумани 2-умумтаълим мактаби бўйича ${year} йил ${day} ${monthName} куни дарсга келмаган ўқувчилар тўғрисидаги Маълумот`;

    const element = document.getElementById("attendanceTable");
    const opt = {
      margin: 1,
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(element).set(opt).save();
  });
});
