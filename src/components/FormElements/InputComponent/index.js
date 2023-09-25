export default function InputComponent({ label, register, ...props }) {
  return (
    <div className="relative">
      <p className="py-0 px-1 absolute -mt-3 mr-0 mb-0 ml-2 font-medium bg-background">{label}</p>
      <input
        className="border focus:outline-none focus:border-black w-full p-4 mx-0 mt-0 text-base block bg-background border-secondary-foreground focus:border-secondary-foreground rounded-md"
        {...props}
        {...register}
      />
    </div>
  );
}
