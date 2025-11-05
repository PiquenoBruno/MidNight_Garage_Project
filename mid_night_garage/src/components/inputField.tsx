interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ label, type, value, onChange }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-color text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-text-background text-text-color border border-primaria rounded-xl focus:outline-none focus:ring-2 focus:ring-destaque"
      />
    </div>
  );
}
