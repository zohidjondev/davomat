document.addEventListener("DOMContentLoaded", () => {
  const studentSelect = document.getElementById("studentSelect");
  const attendanceTable = document.getElementById("attendanceTable").querySelector("tbody");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const deleteLastBtn = document.querySelector(".deleteLastBtn"); // Ensure this matches the correct ID
  const printBtn = document.getElementById("printBtn");
  const caption = document.querySelector("#attendanceTable caption");
  const reasonInput = document.getElementById("reasonInput");
  let studentCount = 0;

  // Define month names in Uzbek Cyrillic
  const monthNames = [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
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

      // Add selected student(s) to the table
      addStudentBtn.addEventListener("click", () => {
        const selectedOptions = Array.from(studentSelect.selectedOptions);
        // Use 'noaniq' as default value for the reason if not provided
        const reasonText = reasonInput.value.trim() || 'сабабсиз';

        selectedOptions.forEach((option) => {
          const student = students[option.value];
          const row = attendanceTable.insertRow();
          studentCount++;

          row.insertCell(0).textContent = studentCount; // №
          row.insertCell(1).textContent = student.fullName; // Student Name
          row.insertCell(2).textContent = student.mfy; // MFY
          row.insertCell(3).textContent = student.street; // Street
          row.insertCell(4).textContent = student.house; // House
          row.insertCell(5).textContent = student.parentsName; // Parents Name
          row.insertCell(6).textContent = student.parentNumber; // Parent's Phone Number
          row.insertCell(7).textContent = reasonText; // Reason for absence
        });

        // Clear the reason input after adding the student
        reasonInput.value = "";
      });
    })
    .catch((error) => console.error("Error fetching the student data:", error));

  // Set the table caption dynamically
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const monthIndex = today.getMonth(); // Month index (0-11)
  const monthName = monthNames[monthIndex]; // Get the month name from the array

  caption.textContent = `Бешарик тумани 2-умумтаълим мактаби 10 - В синфи бўйича ${year} йил ${day} - ${monthName} куни дарсга келмаган ўқувчилар тўғрисидаги маълумот.`;

  // Delete the last row from the table
  deleteLastBtn.addEventListener("click", () => {
    const rows = attendanceTable.rows.length;
    if (rows > 0) {
      attendanceTable.deleteRow(rows - 1);
      studentCount--;
    }
  });

  // Download PDF with html2pdf
  printBtn.addEventListener("click", () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "."); // Format: dd.mm.yyyy
    const pdfFileName = `${formattedDate}-davomat.pdf`;

    // Update caption with the current date for the PDF
    caption.textContent = `Бешарик тумани 2-умумтаълим мактаби, 10 В синф бўйича ${year} йил ${day} ${monthName} куни дарсга келмаган ўқувчилар тўғрисидаги маълумот`;

    const element = document.getElementById("attendanceTable");
    const opt = {
      margin: 1,
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    // Generate and download the PDF
    html2pdf().from(element).set(opt).save();
  });
});
