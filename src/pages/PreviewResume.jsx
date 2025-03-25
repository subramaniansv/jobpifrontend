import { useParams } from "react-router-dom";

const PreviewResume = () => {
  const { resumeId } = useParams();

  // Open the EJS template in a new tab
  const handlePreview = () => {
    window.open(`http://localhost:5000/api/user/preview-resume/${resumeId}`, "_blank");
  };

  return (
    <div>
      <h1>Resume Preview</h1>
      <button onClick={handlePreview}>Open Resume Preview</button>
    </div>
  );
};

export default PreviewResume;
