import { auth } from '@clerk/nextjs/server';

export default function Dashboard() {
  const { userId } = auth();
  if (!userId) return null;
  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
    </div>
  );
}
