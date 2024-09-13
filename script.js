document.addEventListener("DOMContentLoaded", () => {
  const studentSelect = document.getElementById("studentSelect");
  const attendanceTable = document
    .getElementById("attendanceTable")
    .querySelector("tbody");
  const addStudentBtn = document.getElementById("addStudentBtn");
  let studentCount = 0;

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
          row.insertCell(5).textContent = ""; // Parents Name (for future use)
          row.insertCell(6).textContent = ""; // Number (for future use)
        });
      });
    })
    .catch((error) => console.error("Error fetching the student data:", error));

  // Print the table
  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });
});

document.getElementById("printBtn").addEventListener("click", () => {
  const element = document.getElementById("attendanceTable");
  const opt = {
    margin: 1,
    filename: "attendance.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
  };

  html2pdf().from(element).set(opt).save();
});
