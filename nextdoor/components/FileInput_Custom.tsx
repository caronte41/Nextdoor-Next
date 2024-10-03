import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export interface InputCustomProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label for the input
  errorMessage?: string; // Optional error message
}

export function FileInput_Custom<HTMLInputElement, InputCustomProps>({
  onChange,
  label,
}) {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      onChange(file); // Pass the file itself to the form
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 relative">
      <Label htmlFor="picture">{label}</Label>

      {/* Wrapper for Input and Image */}
      <div className="relative w-full">
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleImageChange} // Do not bind "value" to file inputs
          className={`relative z-10 bg-transparent ${
            imagePreview ? "h-64" : ""
          }`} // Adjust height if there's an image
          style={{ paddingBottom: imagePreview ? "40px" : "0" }}
        />

        {/* Image Preview inside the input border */}
        {imagePreview && (
          <div className="absolute top-10 left-0 right-0 w-full h-[calc(100%-40px)] p-2 flex items-center justify-center">
            <Image
              src={imagePreview}
              alt="Uploaded Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
