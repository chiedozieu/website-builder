import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import type { Message, Project, Version } from "../types";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}
const Sidebar = ({
  isMenuOpen,
  project,
  setProject,
  isGenerating,
  setIsGenerating,
}: SidebarProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const handleRollBack = async (versionId: string) => {};

  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.conversation.length, isGenerating]);

  return (
    <div
      className={`h-full sm:max-w-sm rounded-xl bg-gray-800 border border-gray-700 transition-all ${
        isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* message container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
          {[...project.conversation, ...project.versions]
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            )
            .map((message) => {
              const isMessage = "content" in message;
              if (isMessage) {
                const msg = message as Message;
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : " justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="size-7 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                        <BotIcon className="text-gray-400 size-5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-2 px-4 rounded-lg shadow-sm text-sm mt-5 leading-relaxed ${
                        isUser
                          ? "bg-linear-to-r from-indigo-500 to-indigo-600 rounded-tr-none text-white"
                          : "bg-gray-700 text-gray-100 rounded-tl-none"
                      }`}
                    >
                    {msg.content}
                    </div>
                    {isUser && (
                      <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserIcon className="text-gray-200 size-5" />
                      </div>
                    )}
                  </div>
                );
              } else {
                const ver = message as Version;
                return (
                  <div
                    key={ver.id}
                    className="w-4/5 bg-gray-700 text-gray-100 text-xs p-3 shadow rounded-md text-center my-2 flex flex-col gap-2"
                  >
                    <div className="text-xs font-medium">
                      code updated <br />{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between ">
                      {project.current_version_index === ver.id ? (
                        <button className="px-3 py-1 rounded-md text-xs bg-gray-700">
                          Current version
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRollBack(ver.id)}
                          className="px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          Roll back to this version
                        </button>
                      )}
                      <Link
                        target="_blank"
                        to={`/preview/${project.id}/${ver.id}`}
                        className=""
                      >
                        <EyeIcon className="rounded size-6 p-1 bg-gray-700 hover:bg-indigo-600 transition-colors" />
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          {isGenerating && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <BotIcon className="text-white size-5" />
              </div>
              {/* 3dots loader */}
              <div className="flex gap-1.5 h-full items-end">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce bg-gray-600"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}
          <div ref={messageRef} />
        </div>

        {/* input area */}
        <form onSubmit={handleRevisions} className="m-3 relative">
          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-700 text-sm text-white resize-none placeholder-gray-400 transition-all"
              disabled={isGenerating}
              placeholder="Describe your website or request changes..."
              rows={4}
            />
            <button
              disabled={isGenerating || !input.trim()}
              className="absolute bottom-2.5 right-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2Icon className="animate-spin text-indigo-200 size-7 p-1.5" />
              ) : (
                <SendIcon className="text-white size-7 p-1.5 " />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
