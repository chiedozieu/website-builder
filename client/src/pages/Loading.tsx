import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 6000);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <Loader2 className="text-indigo-200 animate-spin size-7" />
      </div>
    </div>
  );
};

export default Loading;
