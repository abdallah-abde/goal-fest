import LoginForm from "@/components/forms/LoginForm";

export default async function LoginPage() {
  return (
    <div className='h-screen flex flex-col gap-4 py-24 items-center justify-center'>
      <LoginForm />
    </div>
  );
}
