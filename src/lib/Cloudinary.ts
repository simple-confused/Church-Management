
import axios from "axios";


export const uploadCloudinary = async (
  image: FileList,
  type: "sign-up" | "people"
) => {
  try {
    const newFormData = new FormData();
    newFormData.append("file", image[0]);
    newFormData.append(
      "upload_preset",
      type === "sign-up"
        ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        : process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PEOPLE!
    );
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_CLOUDINARY_URL!,
      newFormData
    );
    return data;
  } catch (err) {
    return null;
  }
};

// export const deleteCloudinary = async (public_id: string) => {
//   try {
//     const cloudinaryResponse = await cloudinary.uploader.destroy(public_id);
//     return cloudinaryResponse;
//   } catch (err) {
//     return null;
//   }
// };
