
import React from 'react';
import { Wallet } from 'lucide-react';
import LoginForm from '@/components/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center">
        <div className="max-w-md text-center text-white p-8">
          <Wallet className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">FinFlow</h1>
          <p className="text-primary-foreground/80 text-lg">
            Gerencie suas finanças pessoais com facilidade e tenha controle total sobre seu dinheiro.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-sm border">
          <div className="flex items-center justify-center lg:hidden mb-6">
            <Wallet className="h-8 w-8 text-primary mr-2" />
            <span className="font-bold text-2xl">FinFlow</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
