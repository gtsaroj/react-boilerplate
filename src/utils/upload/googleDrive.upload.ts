import useDrivePicker from 'react-google-drive-picker';
import { toaster } from '../toast/toast';

export const useGoogleDrivePicker =  () => {
    const [openPicker, authResponse] = useDrivePicker();

    function handleGoogleDriveUpload(onFileUpload: (files: File[]) => void, documentType: string) {
      console.log("authResponse", authResponse)
      if (authResponse?.access_token) {
        localStorage.setItem("access_token", authResponse.access_token)
      }
      try {
        openPicker({
          clientId: import.meta.env.VITE_ClientID,
          developerKey: import.meta.env.VITE_ApiKey,
          viewId: "DOCS",
          showUploadView: true,
          showUploadFolders: true,
          supportDrives: true,
          token: authResponse?.access_token,
          // setOrigin: window.location.origin,
          multiselect: documentType !== "passport_photo",
          callbackFunction: async (data) => {
            if (data.action === 'picked') {
              for (const doc of data.docs) {
                try {
                  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
                    headers: {
                      'Authorization': `Bearer ${authResponse?.access_token ?? localStorage?.getItem("access_token")}`
                    }
                  });
  
                  if (!response.ok) {
                    throw new Error(`Failed to download file: ${response.statusText}`);
                  }
  
                  const blob = await response.blob();
                  const file = new File([blob], doc.name || 'document', { type: blob.type });
                  onFileUpload([file]);
                } catch (error) {
                  console.error('Error downloading file from Google Drive:', error);
          toaster({
              className:"bg-red-50",
              icon:"error",
              message:`Failed to process file: ${doc.name}`,
              title:"Error"
          })
                }
              }
            }
          },
        });
      } catch (error) {
        console.error('Error opening Google Drive picker:', error);
        toaster({
          className:"bg-red-50",
          icon:"error",
          message:"Failed to open Google Drive picker",
          title:"Error"
        })
      }
    }

    return{
      handleGoogleDriveUpload
    }
  };