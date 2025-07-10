import { toast as baseToast } from "@/hooks/use-toast"

export const toast = {
  success: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: "success",
    })
  },
  
  error: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: "destructive",
    })
  },
  
  warning: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: "warning",
    })
  },
  
  info: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: "info",
    })
  },
  
  // Default toast
  default: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: "default",
    })
  }
}

// Export commonly used toast messages
export const toastMessages = {
  success: {
    saved: "Changes saved successfully!",
    created: "Created successfully!",
    updated: "Updated successfully!",
    deleted: "Deleted successfully!",
    uploaded: "Upload completed successfully!",
    sent: "Message sent successfully!",
  },
  error: {
    generic: "Something went wrong",
    network: "Network error occurred",
    validation: "Please check your input",
    upload: "Upload failed",
    notFound: "Item not found",
    unauthorized: "You are not authorized to perform this action",
  },
  loading: {
    saving: "Saving changes...",
    loading: "Loading...",
    uploading: "Uploading...",
    processing: "Processing...",
  }
}
