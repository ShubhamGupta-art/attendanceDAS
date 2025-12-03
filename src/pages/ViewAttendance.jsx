import { useState, useEffect } from "react";
import { databases } from "../appwriteConfig";
import { Query } from "appwrite";
import StudentCard from "../components/StudentCard";

export default function ViewAttendance() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [presentStudentsList, setPresentStudentsList] = useState([]);

  const DB_ID = "6915f65f0022af0c06b7";
  const ATTENDANCE_COLLECTION = "attendance";
  const STUDENTS_COLLECTION = "mtechstudents";

  const SUBJECTS = [
    "Advanced Data Structure (ADS)",
    "Advanced Computer Network (ACN)",
    "Research Methodology & IPR (RM & IPR)",
    "Multimedia System (MM)",
    "Soft Computing (SC)",
    "Cluster and Grid Computing Specialized (CGC)",
    "Advanced Computer Architecture (ACA)"
  ];

  // Fetch all students on mount to map roll numbers to details
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, STUDENTS_COLLECTION);
        setAllStudents(res.documents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = async () => {
    if (!subject || !date) {
        alert("Please select subject and date");
        return;
    }
    setLoading(true);
    setRecord(null);
    setPresentStudentsList([]);

    try {
      const res = await databases.listDocuments(
        DB_ID,
        ATTENDANCE_COLLECTION,
        [
          Query.equal("subject", subject),
          Query.equal("date", date)
        ]
      );
      if (res.documents.length > 0) {
        const foundRecord = res.documents[0];
        setRecord(foundRecord);
        
        // Filter student details for those who are present
        // Note: roll_no in DB is int, presentStudents in attendance is array of strings
        const present = allStudents.filter(student => 
          foundRecord.presentStudents.includes(String(student.roll_no))
        );
        setPresentStudentsList(present);
      } else {
        alert("No record found for this subject and date.");
      }
    } catch (error) {
        console.error(error);
        alert("Error fetching attendance");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="view-attendance">
      <h2>View Attendance</h2>
      <div className="search-form">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        >
          <option value="">Select Subject</option>
          {SUBJECTS.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSearch} disabled={loading} className="search-btn">
            {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {record && (
        <div className="results">
          <h3>Present Students ({presentStudentsList.length})</h3>
          <div className="students-grid">
            {presentStudentsList.map((student) => (
              <StudentCard
                key={student.$id}
                student={student}
                marked={true}
                toggle={() => {}} // No-op for view only
                onDelete={() => {}} // No-op for view only
                isAdmin={false}
              />
            ))}
            {presentStudentsList.length === 0 && (
               <p>No student details found matching the attendance record.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
