import { toaster } from "../toast/toast";

export const initDropbox = () => {
  const script = document.createElement("script");
  script.src = "https://www.dropbox.com/static/api/2/dropins.js";
  script.id = "dropboxjs";
  script.setAttribute(
    "data-app-key",
    import.meta.env.VITE_DROPBOX_ACCESS_TOKEN
  ); // Replace with your Dropbox app key
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
};

declare global {
  interface Window {
    Dropbox: any;
  }
}

export const handleDropboxUpload = (
  onFileUpload: (files: File[]) => void,
  documentType: string
) => {
  if (window.Dropbox) {
    window.Dropbox.choose({
      success: async (files: any[]) => {
        for (const file of files) {
          try {
            const response = await fetch(file.link);
            if (!response.ok) {
              throw new Error(
                `Failed to download file: ${response.statusText}`
              );
            }

            const blob = await response.blob();
            const fileObj = new File([blob], file.name, { type: blob.type });
            onFileUpload([fileObj]);
          } catch (error) {
            console.error("Error downloading file from Dropbox:", error);
            toaster({
              className: "bg-red-50",
              icon: "error",
              message: `Failed to process file: ${file.name}`,
              title: "Error",
            });
          }
        }
      },
      linkType: "direct",
      multiselect: documentType !== "passport_photo",
      extensions: [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
    });
  } else {
    toaster({
      className: "bg-red-50",
      icon: "error",
      message: "Dropbox Chooser not loaded",
      title: "Error",
    });
  }
};
