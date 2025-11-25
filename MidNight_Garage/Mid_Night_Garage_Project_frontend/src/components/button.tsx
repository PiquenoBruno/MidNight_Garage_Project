interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-primaria text-background py-2 rounded-xl font-semibold hover:bg-destaque transition hover:shadow-[0_0_10px_#F8FCFF]"
    >
      {text}
    </button>
  );
}
