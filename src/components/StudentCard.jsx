import { useState } from "react";
import { databases } from "../appwriteConfig";

export default function StudentCard({ student, marked, toggle, onDelete, isAdmin }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete ${student.name}?`)) {
      setDeleting(true);
      try {
        await databases.deleteDocument(
          "6915f65f0022af0c06b7", // DB_ID
          "mtechstudents",        // COLLECTION_ID
          student.$id
        );
        onDelete(student.$id);
        alert("Student deleted successfully");
      } catch (e) {
        alert(e.message || "Error deleting student");
      } finally {
        setDeleting(false);
      }
    }
  };

  // Fallback image if student.photo_url is missing or broken
  // We check photo_url (snake_case) first, then photoUrl (camelCase) for backward compatibility
  const DEFAULT_IMAGE = "https://fra.cloud.appwrite.io/v1/storage/buckets/69303098001f418c3bab/files/693039680008c8131999/view?project=69136f270017ad716d00";

  const imageUrl = (student.photo_url || student.photoUrl) 
    ? (student.photo_url || student.photoUrl)
    : DEFAULT_IMAGE;

  return (
    <div className="card">
      <div className="card-header">
        <img
          src={imageUrl}
          alt={student.name}
          onError={(e) => {
            // Prevent infinite loop if placeholder also fails
            if (e.target.src !== DEFAULT_IMAGE) {
              e.target.src = DEFAULT_IMAGE;
            }
          }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{student.name || "Unknown"}</h5>
        <p className="card-text">
          Roll No: {student.roll_no || "N/A"}
        </p>
      </div>
      <div className="card-footer">
        <button
          onClick={() => toggle(student.roll_no)}
          className={`btn ${marked ? "btn-present" : "btn-absent"}`}
        >
          {marked ? "Present" : "Mark Present"}
        </button>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-delete"
          >
            {deleting ? "..." : "🗑"}
          </button>
        )}
      </div>
    </div>
  );
}
