
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  BarChart4, 
  Settings, 
  PieChart,
  LogOut,
  CreditCard,
  Tags
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">FinFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/')}>
                  <Link to="/" className="flex items-center gap-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/transactions')}>
                  <Link to="/transactions" className="flex items-center gap-3">
                    <Receipt className="h-5 w-5" />
                    <span>Transações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/categories')}>
                  <Link to="/categories" className="flex items-center gap-3">
                    <Tags className="h-5 w-5" />
                    <span>Categorias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/accounts')}>
                  <Link to="/accounts" className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span>Contas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Análises</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/reports')}>
                  <Link to="/reports" className="flex items-center gap-3">
                    <BarChart4 className="h-5 w-5" />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={isActive('/budget')}>
                  <Link to="/budget" className="flex items-center gap-3">
                    <PieChart className="h-5 w-5" />
                    <span>Orçamento</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-active={isActive('/settings')}>
              <Link to="/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center text-destructive gap-3 w-full">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
