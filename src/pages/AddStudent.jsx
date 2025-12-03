import { useState } from "react";
import { databases, storage } from "../appwriteConfig";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const DB_ID = "6915f65f0022af0c06b7";
  const STUDENTS_COLLECTION = "mtechstudents";
  const BUCKET_ID = "69303098001f418c3bab"; 

  const addStudent = async () => {
    if (!name || !rollNo) {
      alert("Please fill in name and roll number");
      return;
    }

    setLoading(true);
    try {
      // Use placehold.co instead of via.placeholder.com to avoid network errors
      let photoUrl = "https://placehold.co/600x400?text=No+Photo";

      if (photo) {
        try {
          const uploaded = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            photo
          );
          // Get the file view URL
          photoUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          alert("Failed to upload image. Please check your Bucket permissions (Role: Any -> Read).");
          setLoading(false);
          return;
        }
      }

      await databases.createDocument(
        DB_ID,
        STUDENTS_COLLECTION,
        ID.unique(),
        {
          name,
          roll_no: parseInt(rollNo),
          photo_url: photoUrl // Changed from photoUrl to photo_url to match snake_case convention
        }
      );
      alert("Student added successfully!");
      setName("");
      setRollNo("");
      setPhoto(null);
    } catch (e) {
      console.error(e);
      alert(e.message || "Error adding student");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    nav("/admin");
  };

  return (
    <div className="add-student-container">
      <div className="add-student-form">
        <h2>Add New Student</h2>
        
        <div className="form-group">
          <label>Student Name *</label>
          <input
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Roll Number *</label>
          <input
            type="text"
            placeholder="Enter roll number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Profile Picture</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="input-field"
          />
        </div>

        <div className="form-actions">
          <button onClick={addStudent} disabled={loading} className="add-btn">
            {loading ? "Adding..." : "Add Student"}
          </button>
          <button onClick={goBack} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}