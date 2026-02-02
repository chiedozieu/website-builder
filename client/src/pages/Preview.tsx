import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProjects } from "../assets/site-builder-assets/assets/assets";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project } from "../types";

const Preview = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();

  const fetchCode = async () => {
    setTimeout(() => {
      const code = dummyProjects.find((p) => p.id === projectId)?.current_code;
      if (code) {
        setCode(code);
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchCode();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="animate-spin text-indigo-200 size-7" />
      </div>
    );
  }

  return (
    <div className="h-screen">
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};

export default Preview;
