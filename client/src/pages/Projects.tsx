import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import {
  ArrowBigDownDashIcon,
  Eye,
  EyeOff,
  FullscreenIcon,
  LaptopIcon,
  Loader2Icon,
  MessageSquareIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
} from "lucide-react";
import {
  dummyConversations,
  dummyProjects,
  dummyVersion,
} from "../assets/site-builder-assets/assets/assets";
import Sidebar from "../components/Sidebar";
import ProjectPreview, {
  type ProjectPreviewRef,
} from "../components/ProjectPreview";

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">(
    "desktop"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewRef = useRef<ProjectPreviewRef>(null);

  const fetchProjects = async () => {
    const project = dummyProjects.find((p) => p.id === projectId);

    setTimeout(() => {
      if (project) {
        setProject({
          ...project,
          conversation: dummyConversations,
          versions: dummyVersion,
        });
        setLoading(false);
        setIsGenerating(project.current_code ? false : true);
      }
    }, 2000);
  };

  const saveProject = async () => {};

  const downloadCode = () => {
    // download code (index.html)
    const code = previewRef.current?.getCode() || project?.current_code;
    if(!code) {
      if(isGenerating) {
        return
      }
      return 
    }
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element);
    element.click();
  };

  const togglePublish = async () => {};

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Loader2Icon className="animate-spin text-indigo-200 size-7" />
        </div>
      </>
    );
  }

  return project ? (
    <div className="flex flex-col w-full h-screen bg-gray-900 text-white">
      {/* builder navbar */}
      <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar">
        {/* left */}
        <div className="flex items-center gap-2 sm:min-w-90 text-nowrap">
          <img
            src="/favicon.svg"
            alt="logo"
            className="h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="max-w-64 sm:max-w-xs overflow-hidden">
            <p className="text-sm font-medium capitalize truncate ">
              {project.name}
            </p>
            <p className="text-xs text-gray-400 -mt-0.5">
              Previewing last saved version
            </p>
          </div>
          <div className="sm:hidden flex flex-1 justify-end">
            {isMenuOpen ? (
              <MessageSquareIcon
                className="size-6 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              />
            ) : (
              <XIcon
                className="size-6 cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              />
            )}
          </div>
        </div>

        {/* middle */}
        <div className="hidden sm:flex bg-gray-950 p-1.5 rounded-md gap-2">
          <SmartphoneIcon
            onClick={() => setDevice("phone")}
            className={`size-6 cursor-pointer p-1 rounded ${
              device === "phone" ? "bg-indigo-600" : ""
            } `}
          />
          <TabletIcon
            onClick={() => setDevice("tablet")}
            className={`size-6 cursor-pointer p-1 rounded ${
              device === "tablet" ? "bg-indigo-600" : ""
            } `}
          />
          <LaptopIcon
            onClick={() => setDevice("desktop")}
            className={`size-6 cursor-pointer p-1 rounded ${
              device === "desktop" ? "bg-indigo-600" : ""
            } `}
          />
        </div>

        {/* right */}
        <div className="flex items-center gap-3 justify-end flex-1 text-xs sm:text-sm">
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white transition-colors rounded px-3.5 py-1 flex items-center gap-2 sm:rounded-sm border border-gray-700"
          >
            {isSaving ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <SaveIcon size={16} />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
          <Link
            target="_blank"
            to={`/preview/${projectId}`}
            className="flex items-center gap-2 hover:border-gray-500 transition-colors rounded px-4 py-1 sm:rounded-sm border border-gray-700"
          >
            {" "}
            <FullscreenIcon size={16} />
            Preview
          </Link>
          <button
            onClick={downloadCode}
            className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"
          >
            <ArrowBigDownDashIcon size={16} />
            Download
          </button>
          <button
            onClick={togglePublish}
            className="bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors"
          >
            {project.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
            {project.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-auto">
        <div className="">
          <Sidebar
            isMenuOpen={isMenuOpen}
            project={project}
            setProject={(p) => setProject(p)}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>
        <div className="flex-1 p-2 pl-0">
          <ProjectPreview
            ref={previewRef}
            project={project}
            isGenerating={isGenerating}
            device={device}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-medium text-gray-200">
        Unable to find the project!{" "}
      </p>
    </div>
  );
};

export default Projects;
