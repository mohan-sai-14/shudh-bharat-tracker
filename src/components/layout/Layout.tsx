import { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}