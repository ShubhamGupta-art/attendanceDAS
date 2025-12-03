import { useEffect, useState } from "react";
import { databases } from "../appwriteConfig";
import { ID } from "appwrite";
import { Link } from "react-router-dom";
import StudentCard from "../components/StudentCard";
import { useUser } from "../lib/context/user"; // Import useUser hook

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [present, setPresent] = useState(new Set());
  const { user } = useUser(); // Get current user

  // Configuration Constants
  const DB_ID = "6915f65f0022af0c06b7";
  const STUDENTS_COLLECTION = "mtechstudents";
  const ATTENDANCE_COLLECTION = "attendance";

  const SUBJECTS = [
    "Advanced Data Structure (ADS)",
    "Advanced Computer Network (ACN)",
    "Research Methodology & IPR (RM & IPR)",
    "Multimedia System (MM)",
    "Soft Computing (SC)",
    "Cluster and Grid Computing Specialized (CGC)",
    "Advanced Computer Architecture (ACA)"
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, STUDENTS_COLLECTION);
        setStudents(res.documents);
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };
    load();
  }, []);

  const togglePresent = (rollNo) => {
    const s = new Set(present);
    if (s.has(rollNo)) s.delete(rollNo);
    else s.add(rollNo);
    setPresent(s);
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((s) => s.$id !== id));
  };

  const save = async () => {
    if (!subject || !date) {
      alert("Please select subject and date");
      return;
    }
    
    if (!user) {
      alert("You must be logged in to save attendance.");
      return;
    }

    try {
      // Convert roll numbers to strings to match Appwrite schema (Array of Strings)
      const presentList = Array.from(present).map(String);

      await databases.createDocument(
        DB_ID,
        ATTENDANCE_COLLECTION,
        ID.unique(),
        {
          subject,
          date,
          presentStudents: presentList,
          who_created: user.email // Add the user's email here
        }
      );
      alert("Attendance saved!");
      setPresent(new Set());
    } catch (error) {
      console.error(error);
      alert("Error saving attendance: " + error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Mark Attendance</h2>
      <div className="controls">
        <Link to="/add-student" className="add-student-btn">Add New Student</Link>
      </div>
      
      <div className="attendance-form">
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
      </div>

      <div className="students-grid">
        {students.map((s) => (
          <StudentCard
            key={s.$id}
            student={s}
            marked={present.has(s.roll_no)}
            toggle={togglePresent}
            onDelete={handleDeleteStudent}
            isAdmin={true}
          />
        ))}
      </div>

      <button onClick={save} className="save-btn">Save Attendance</button>
    </div>
  );
}
