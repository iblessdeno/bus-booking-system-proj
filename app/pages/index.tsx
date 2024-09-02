import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">M-Pesa Savings Tracker</h1>
      <Dashboard />
    </main>
  );
}