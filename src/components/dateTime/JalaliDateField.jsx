import AdapterJalali from "./AdapterJalali";
import { TextField } from "@mui/material";

export default function JalaliDateField({ name, value, onChange, label, className }) {
  const formatDateLocal = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-gray-600 text-sm">{label}</label>}
      <AdapterJalali
        value={value ? new Date(value) : null}
        onChange={(newValue) => {
          const iso = newValue ? formatDateLocal(new Date(newValue)) : "";
          onChange({ target: { name, value: iso } });
        }}
        renderInput={(params) => (
          <TextField
            className={className}
            {...params}
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "0.5rem",
                backgroundColor: "white",
              },
            }}
          />
        )}
      />
    </div>
  );
}
