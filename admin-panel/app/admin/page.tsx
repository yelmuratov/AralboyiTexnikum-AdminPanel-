'use client';

import { useState, useEffect } from 'react';
import withAuth from '../components/withAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'; // Added for image optimization
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChartIcon, HomeIcon, MoveHorizontalIcon, SearchIcon, SettingsIcon, UniversityIcon, UserIcon, UsersIcon } from 'lucide-react';
import { AddApplicantModal } from '@/components/ui/AddApplicantModal';
import { EditApplicantModal } from '@/components/ui/EditApplicantModal';

interface Applicant {
  id?: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  phone_number: string;
  secondary_phone_number: string;
  category: number;
  source: string;
  created_at?: string;
  updated_at?: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    fetchApplicants();
    fetchCategories();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get<Applicant[]>('https://aralboyitexnikum.uz/api/backend/admission/applicants/');
      setApplicants(response.data);
    } catch (error) {
      console.error('Failed to fetch applicants', error);
      // Optional: Show user feedback or notification here
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ id: number; name: string }[]>('https://aralboyitexnikum.uz/api/backend/admission/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      // Optional: Show user feedback or notification here
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentApplicant(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://aralboyitexnikum.uz/api/backend/admission/applicants/${id}/`);
      fetchApplicants();
    } catch (error) {
      console.error('Failed to delete applicant', error);
      // Optional: Show user feedback or notification here
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.middle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.phone_number.includes(searchTerm) ||
    applicant.secondary_phone_number.includes(searchTerm)
  );

  return (
    <>
      <div className="flex min-h-screen w-full bg-muted/40">
        <div className="flex flex-col w-full sm:gap-4 sm:py-4">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#" prefetch={false}>
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Applicants</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" aria-label="User menu" variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <Image
                    src="/user.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Applicants</CardTitle>
                <CardDescription>Manage applicants for your university.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="mb-4" onClick={openAddModal}>Add Applicant</Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Middle Name</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Secondary Phone</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>{applicant.first_name}</TableCell>
                        <TableCell>{applicant.last_name}</TableCell>
                        <TableCell>{applicant.middle_name}</TableCell>
                        <TableCell>{applicant.date_of_birth}</TableCell>
                        <TableCell>{applicant.phone_number}</TableCell>
                        <TableCell>{applicant.secondary_phone_number}</TableCell>
                        <TableCell>{applicant.category}</TableCell>
                        <TableCell>{applicant.source}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" aria-label="Actions" size="icon" variant="ghost">
                                <MoveHorizontalIcon className="w-4 h-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(applicant)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(applicant.id!)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <AddApplicantModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        fetchApplicants={fetchApplicants}
        categories={categories}
      />

      <EditApplicantModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        fetchApplicants={fetchApplicants}
        applicant={currentApplicant}
        categories={categories}
      />
    </>
  );
};

export default withAuth(AdminPage);
