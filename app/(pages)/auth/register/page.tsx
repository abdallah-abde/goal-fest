import RegisterForm from "@/components/forms/RegisterForm";

export default async function RegisterPage() {
  return (
    <div className='h-screen flex flex-col gap-4 py-24 items-center justify-center'>
      <RegisterForm />
    </div>
  );
}
